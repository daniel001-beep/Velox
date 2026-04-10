"use client";

import { useContext } from "react";
import Link from "next/link";
import { CartContext } from "@/app/components/Providers";

export default function Cart() {
  const cartContext = useContext(CartContext);
  const { cart = [], removeFromCart = () => {}, updateQuantity = () => {}, cartTotal = 0, cartCount = 0 } = cartContext || {};

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-linear-to-br from-blue-700 to-blue-900 rounded-2xl p-10 md:p-14 text-center mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 flex items-center justify-center gap-4">
            <i className="fas fa-shopping-cart text-blue-300"></i> Your Shopping Cart
          </h1>
          <p className="text-blue-100 text-lg">Review your items and proceed to checkout</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
          <i className="fas fa-shopping-cart text-7xl text-gray-500 mb-6 drop-shadow-lg"></i>
          <h3 className="text-3xl font-bold text-white mb-4">Your cart is empty</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover something new and exciting today!</p>
          <Link href="/products" className="inline-flex items-center gap-2 btn flex px-8 py-4 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
            Start Shopping <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items List */}
          <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <i className="fas fa-box text-blue-500"></i> Cart Items 
                <span className="bg-blue-600 text-sm text-white px-3 py-1 rounded-full">{cart.length}</span>
              </h2>
              <button 
                onClick={() => {
                  if (window.confirm("Clear entire cart?")) {
                    cart.forEach((item: any) => removeFromCart(item.id, item.size));
                  }
                }}
                className="text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 px-4 py-2 rounded-lg font-semibold transition"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {cart.map((item: any) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-black/20 rounded-2xl border border-white/5 relative group">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-xl border-2 border-white/10 shadow-md"
                    />
                    
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-400">
                        <span><i className="fas fa-tag"></i> {item.size}</span>
                        <span><i className="fas fa-dollar-sign"></i> {item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-xl">
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex justify-center items-center bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white font-bold transition"
                      >-</button>
                      <input 
                        type="number" 
                        value={item.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(item.id, item.size, parseInt(e.target.value) || 1)}
                        className="w-12 text-center bg-transparent text-white font-bold outline-none"
                      />
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 flex justify-center items-center bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white font-bold transition"
                      >+</button>
                    </div>

                    <div className="text-xl font-bold text-white w-24 text-center sm:text-right">
                      ${itemTotal.toFixed(2)}
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 w-10 h-10 rounded-full flex justify-center items-center transition absolute top-4 right-4 sm:relative sm:top-0 sm:right-0"
                    >
                      <i className="fas fa-trash text-lg"></i>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white/5 rounded-2xl border border-white/10 shadow-xl p-8 sticky top-32">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i className="fas fa-receipt text-blue-500"></i> Order Summary
              </h3>
              
              <div className="space-y-4 mb-6 text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={`${cartTotal > 100 ? "text-green-400 font-semibold" : "text-white"}`}>
                    {cartTotal > 100 ? "Free" : "$10.00"}
                  </span>
                </div>
                <div className="flex justify-between text-yellow-500/90">
                  <span>Tax (10%)</span>
                  <span>${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="h-px bg-white/10 mb-6"></div>

              <div className="flex justify-between items-center text-2xl font-bold text-white mb-8">
                <span>Total</span>
                <span>${(cartTotal + (cartTotal > 100 ? 0 : 10) + cartTotal * 0.1).toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="w-full inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition mb-4">
                Proceed to Checkout
              </Link>

              <div className="text-center">
                <Link href="/products" className="text-gray-400 hover:text-white transition flex items-center justify-center gap-2">
                  <i className="fas fa-arrow-left"></i> Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
