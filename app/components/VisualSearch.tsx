"use client";

import { useState } from "react";
import { Camera, Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VisualSearch() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiDescription, setAiDescription] = useState("");
  const [visualOpen, setVisualOpen] = useState(false);

  const handleSearch = async () => {
    if (!file) return;
    setLoading(true);
    setResults([]);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/visual-search", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setAiDescription(data.aiDescription);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12 w-full max-w-3xl mx-auto">
      {/* Primary Search Bar */}
      <div className="relative w-full group flex items-center justify-center px-4">
          <div className="relative w-full max-w-2xl">
            <input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full bg-white/10 backdrop-blur-md text-white rounded-full py-3 md:py-4 pl-10 md:pl-12 pr-20 border border-white/20 focus:border-blue-500 outline-none shadow-lg text-base transition-all focus:bg-white/15" 
            />
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors w-4 h-4 md:w-5 md:h-5" />
            <button 
               onClick={() => setVisualOpen(!visualOpen)} 
               className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full flex items-center justify-center w-9 h-9 ring-2 ring-offset-2 ring-offset-[#050505] transition-all duration-300 ${visualOpen ? 'bg-blue-500 text-white ring-blue-500' : 'text-gray-300 hover:text-white hover:bg-white/10 ring-white/20 hover:ring-blue-400'}`}
               title="Visual Search with Camera - Click to snap & shop"
            >
               <Camera className="w-5 h-5 md:w-5 md:h-5" />
            </button>
          </div>
      </div>

      {visualOpen && (
        <div className="mt-6 glass-card p-6 rounded-2xl border border-blue-500/30 bg-blue-900/10 backdrop-blur-xl animate-fade-in relative shadow-2xl z-10">
          <button onClick={() => setVisualOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
             <X size={20} />
          </button>
          
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Camera size={20} className="text-blue-400" /> Snap & Shop
          </h3>
          <p className="text-sm text-gray-300 mb-4">Upload an image and Gemini will magically find similar items in our inventory.</p>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="flex-1 w-full cursor-pointer group">
              <div className="border-2 border-dashed border-white/20 bg-black/20 rounded-xl p-4 text-center group-hover:border-blue-500 transition-colors">
                <span className="text-gray-400 group-hover:text-blue-400 text-sm">
                    {file ? file.name : "Click to select or drag & drop an image"}
                </span>
                <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                 />
              </div>
            </label>
            <button 
                onClick={handleSearch}
                disabled={!file || loading}
                className={`btn px-6 py-3 rounded-xl font-bold transition-all text-sm w-full md:w-auto ${loading ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
            >
                {loading ? "Analyzing..." : "Search"}
            </button>
          </div>

          {aiDescription && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-200 text-sm italic">
                <strong>Gemini:</strong> {aiDescription}
              </div>
          )}

          {results.length > 0 && (
              <div className="mt-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Found {results.length} matching products:</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                      {results.map((p) => (
                          <Link 
                            key={p.id} 
                            href={`/products/${p.id}`}
                            className="min-w-[160px] bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-blue-500 transition-all hover:scale-[1.02] block"
                          >
                              <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3">
                                <Image 
                                  src={p.imageUrl || p.imageurl || "https://picsum.photos/seed/placeholder/800/800"} 
                                  alt={p.name || "Product"} 
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <p className="text-xs font-bold text-white truncate mb-1">{p.name}</p>
                              <p className="text-sm font-black text-blue-400">${p.price.toFixed(2)}</p>
                          </Link>
                      ))}
                  </div>
              </div>
          )}
        </div>
      )}
    </div>
  );
}
