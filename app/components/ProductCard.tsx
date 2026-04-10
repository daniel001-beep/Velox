"use client";

import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  if (!product) return null;
  
  const imageUrl = product.imageUrl || (product as any).imageurl;
  const finalImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl : null;
  
  return (
    <Link href={`/products/${product.id}`} className="product-card-link block">
      <div className="product-card">
        <div className="product-card-img">
          {finalImageUrl ? (
            <Image
              src={finalImageUrl}
              alt={product.name || "Product"}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-gray-400 text-center px-4">Image unavailable</span>
            </div>
          )}
        </div>
        <div className="product-card-info">
          <span className="product-card-category">{product.category}</span>
          <h4 className="product-card-name">{product.name}</h4>
          <div className="product-card-rating">
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star-half-stroke"></i>
            <span className="product-card-rating-text">4.5</span>
          </div>
          <p className="product-card-price">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
