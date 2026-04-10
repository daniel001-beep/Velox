import { db } from "@/src/db";
import { products, reviews } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import ReviewSummarizer from "@/app/components/ReviewSummarizer";
import AddToCartButton from "@/app/components/AddToCartButton";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    if (!id || isNaN(productId)) notFound();
    
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) notFound();

  const productReviews = await db.select().from(reviews).where(eq(reviews.productId, productId)).limit(5);

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="product-detail-container">
        
        {/* Breadcrumb */}
        <Link href="/products" className="product-detail-breadcrumb">
          ← Back to Collection
        </Link>

        {/* Product Detail Grid */}
        <div className="product-detail-grid">
          
          {/* Product Image */}
          <div className="product-detail-image-wrap">
            <div className="product-detail-image">
              <Image
                src={product.imageUrl || (product as any).imageurl || "https://picsum.photos/seed/placeholder/800/800"}
                alt={product.name || "Product"}
                fill
                priority
                unoptimized
                className="object-cover transition-transform hover:scale-105 duration-700"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            
            {/* Name & Category */}
            <div className="product-detail-section">
              <span className="product-detail-category">
                {product.category}
              </span>
              <h1 className="product-detail-name">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="product-detail-price-section">
              <span className="product-detail-price">
                ${product.price.toFixed(2)}
              </span>
              <span className="product-detail-original-price">
                ${(product.price * 1.3).toFixed(2)}
              </span>
              <span className="product-detail-discount">
                Save 23%
              </span>
            </div>

            {/* Description */}
            <div className="product-detail-description">
              <p>
                {product.description}
              </p>
            </div>

            {/* Add to Cart logic with state */}
            <AddToCartButton product={product} />

            {/* Trust Badges */}
            <div className="product-detail-badges">
              <span><i className="fa fa-truck"></i> Free Shipping</span>
              <span><i className="fa fa-shield-halved"></i> Secure Checkout</span>
              <span><i className="fa fa-rotate-left"></i> 30-Day Returns</span>
            </div>
          </div>
        </div>

        {/* Review Summarizer */}
        <div className="product-detail-section-gap">
          <ReviewSummarizer productId={productId} />
        </div>

        {/* Reviews Section */}
        <div className="product-detail-section-gap">
          <h2 className="product-detail-reviews-title">
            Verified Reviews
          </h2>
          <div className="product-detail-reviews-grid">
            {productReviews.length > 0 ? (
              productReviews.map((r) => (
                <div key={r.id} className="product-detail-review-card">
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    {Array.from({ length: r.rating }).map((_, i) => <i key={i} className="fa fa-star text-sm"></i>)}
                  </div>
                  <p className="text-gray-200 leading-relaxed">{r.comment}</p>
                  <p className="text-xs text-gray-500 mt-6 font-mono">Verified Purchase #{r.id}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                <p className="text-gray-400">No reviews yet for this premium item.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
