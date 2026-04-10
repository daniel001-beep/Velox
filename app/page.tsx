import Link from "next/link";
export const dynamic = "force-dynamic";
import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import ProductCard from "@/app/components/ProductCard";


export default async function Home() {
  let featured: any[] = [];
  try {
    featured = await db.select().from(products).limit(4);
  } catch (err: any) {
    console.log("Database not seeded or tables missing. Returning empty featured items.", err.message);
  }
  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      
      {/* Premium Hero Section */}
      <div className="relative container py-24 min-h-[85vh] flex flex-col justify-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2">
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest text-blue-400 uppercase mb-6">
              Welcome to Redstore
            </div>
            <h1 className="text-7xl font-black text-white leading-[1.1] tracking-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-500">
                Lifestyle.
              </span>
            </h1>
            <p className="text-xl text-gray-400 font-light my-8 max-w-lg leading-relaxed">
              Discover a curated collection of premium fashion, tech, and living essentials. Powered by intuitive AI search and seamless performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Explore Collection
              </Link>
              <Link href="/api/seed" className="px-8 py-4 bg-white/5 rounded-full font-bold border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md text-white">
                Initialize Inventory
              </Link>
            </div>
          </div>

          {/* Aesthetic Hero Image with Glassmorphism Float */}
          <div className="lg:w-1/2 relative w-full h-[600px] flex justify-center items-center">
             <div className="absolute inset-x-10 bottom-10 top-20 bg-linear-to-tr from-blue-600 to-purple-600 opacity-20 blur-[80px] rounded-full z-0" />
             <div className="relative z-10 w-full max-w-md float-anim">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30"></div>
                <img 
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000" 
                    className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px] border border-white/10"
                    alt="Premium Aesthetics"
                />
             </div>
             {/* Floating Spec Card */}
             <div className="absolute bottom-24 -left-8 glass-card p-4 rounded-2xl z-20 shadow-xl border border-white/10 animate-fade-in delay-300">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                     <i className="fa fa-gem text-white text-sm"></i>
                   </div>
                   <div>
                     <p className="text-white text-sm font-bold">Premium Quality</p>
                     <p className="text-gray-400 text-xs">Curated Materials</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <div id="featured" className="container py-24 relative z-10">
        <div className="flex items-end justify-between mb-12">
           <div>
             <h2 className="text-4xl font-bold text-white mb-2">Trending Now</h2>
             <p className="text-gray-400">Hand-selected pieces for the modern aesthetic.</p>
           </div>
           <Link href="/products" className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-2 transition-colors">
              View All <i className="fa fa-arrow-right"></i>
           </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featured.length > 0 ? (
                featured.map(p => <ProductCard key={p.id} product={p as any} />)
            ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                    <i className="fa fa-box-open text-4xl text-gray-500 mb-4"></i>
                    <p className="text-gray-400 text-lg">Inventory is currently empty.</p>
                    <Link href="/api/seed" className="mt-4 text-blue-400 underline">Tap here to generate products</Link>
                </div>
            )}
        </div>
      </div>

      {/* Category Showcase Section */}
      <div className="bg-[#0a0a0a] py-32 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Curated Categories</h2>
            <p className="text-gray-400 text-xl font-light max-w-2xl mx-auto">Explore our diverse range of premium collections designed for every aspect of your modern life.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Card 1 */}
            <Link href="/products?category=Electronics" className="group relative h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" alt="Electronics" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-10 left-10">
                <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Precision Gear</span>
                <h3 className="text-4xl font-black text-white mb-2">Electronics</h3>
                <p className="text-gray-300 font-medium">Smart devices for the digital age.</p>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link href="/products?category=Fashion" className="group relative h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" alt="Fashion" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-10 left-10">
                <span className="text-purple-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Style Redefined</span>
                <h3 className="text-4xl font-black text-white mb-2">Fashion</h3>
                <p className="text-gray-300 font-medium">Wear the future of aesthetics.</p>
              </div>
            </Link>

            {/* Category Card 3 */}
            <Link href="/products?category=Furniture" className="group relative h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" alt="Furniture" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-10 left-10">
                <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Living Spaces</span>
                <h3 className="text-4xl font-black text-white mb-2">Furniture</h3>
                <p className="text-gray-300 font-medium">Timeless pieces for your sanctuary.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
