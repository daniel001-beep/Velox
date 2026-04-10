import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import ProductCard from "@/app/components/ProductCard";
import VisualSearch from "@/app/components/VisualSearch";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Products() {
  const allProducts = await db.select().from(products);
  
  // Remove duplicates based on product ID
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="small-container py-16">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">All Products</h2>
            <p className="text-gray-400">Browse our curated collection of {uniqueProducts.length} premium items.</p>
          </div>
          <select className="bg-white/5 text-white rounded-xl px-4 py-3 border border-white/10 outline-none focus:border-blue-500 transition-colors min-w-[180px]">
            <option>Newest Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="mb-14">
          <VisualSearch />
        </div>

        {/* Products Grid */}
        {uniqueProducts.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <i className="fa fa-box-open text-5xl text-gray-600 mb-4 block"></i>
            <h3 className="text-2xl text-gray-400 mb-2">Inventory is empty</h3>
            <p className="text-gray-500">Visit <Link href="/api/seed" className="text-blue-400 underline">/api/seed</Link> to populate 200 items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {uniqueProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
