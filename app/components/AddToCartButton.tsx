"use client";

import { useContext, useState } from "react";
import { CartContext } from "./Providers";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useContext(CartContext) || { addToCart: () => {} };
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("Medium");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="product-detail-options">
        <label className="product-detail-options-label">Options</label>
        <div className="product-detail-options-row">
          <select 
            className="product-detail-select"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option>Large</option>
            <option>Medium</option>
            <option>Small</option>
          </select>
          <input 
            type="number" 
            value={quantity} 
            min={1} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="product-detail-qty" 
          />
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        className={`product-detail-add-btn transition-all duration-300 ${added ? "bg-green-600 scale-95" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {added ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fa fa-check"></i> Added to Cart
          </span>
        ) : (
          "Add to Cart"
        )}
      </button>
    </div>
  );
}
