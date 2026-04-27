"use client";

import { useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartContext } from "@/app/components/Providers";
import { PaymentErrorBoundary } from "@/app/components/ErrorBoundaries";
import {
  processPurchaseTransaction,
  generateIdempotencyKey,
  logCheckoutAttempt,
  logAddressChange,
  recoverTransaction,
} from "@/utils/transaction-idempotency";
import { createClient } from "@/utils/supabase/client";

function CheckoutContent() {
  const router = useRouter();
  const { cartTotal } = useContext(CartContext) || { cartTotal: 0 };
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const shipping = cartTotal > 100 ? 0 : 10;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;
  const supabase = createClient();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleAddressChange = useCallback(
    async (oldAddress: typeof formData, newAddress: typeof formData) => {
      const { data: user } = await supabase.auth.getUser();
      const addressId = `addr_${Date.now()}`;

      await logAddressChange(user?.user?.id || "", addressId, oldAddress, newAddress);
    },
    [supabase]
  );

  const handleCheckout = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsProcessing(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Please sign in to continue");
          router.push("/auth/signin");
          return;
        }

        // Log checkout attempt
        await logCheckoutAttempt(user.id, 0, {
          email: formData.email,
          city: formData.city,
          country: formData.country,
        });

        // Generate unique idempotency key
        const idempotencyKey = generateIdempotencyKey(user.id, Date.now());

        // Attempt to recover any previous transaction
        const recovered = await recoverTransaction(Date.now());
        if (recovered && recovered.status === "completed") {
          setSuccess(true);
          setTimeout(() => router.push("/orders"), 2000);
          return;
        }

        // Process the transaction with idempotency
        const transactionResponse = await processPurchaseTransaction({
          userId: user.id,
          orderId: Date.now(),
          amount: total,
          metadata: {
            email: formData.email,
            address: formData.address,
            city: formData.city,
            country: formData.country,
          },
        });

        if (transactionResponse.status === "completed") {
          setSuccess(true);
          setTimeout(() => router.push("/orders"), 2000);
        } else if (transactionResponse.status === "failed") {
          setError(
            transactionResponse.errorMessage ||
              "Transaction failed. Please try again."
          );
        }
      } catch (err) {
        setError(`Checkout error: ${String(err)}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [formData, total, router, supabase]
  );

  if (success) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-4xl text-green-400"></i>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-400">Redirecting to orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 flex items-center justify-center gap-3">
          <i className="fas fa-lock text-green-500"></i> Secure Checkout
        </h1>
        <p className="text-gray-400 text-lg">Complete your purchase in just a few steps</p>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-12">

        {/* Checkout Form */}
        <form onSubmit={handleCheckout} className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl">

          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <i className="fas fa-envelope text-blue-500"></i> Contact Information
          </h2>
          <div className="mb-10">
            <label className="block text-sm font-medium mb-2 text-gray-300">Email Address *</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white" 
            />
          </div>

          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <i className="fas fa-truck text-blue-500"></i> Shipping Address
          </h2>
          <div className="space-y-5 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">First Name *</label>
                <input type="text" placeholder="John" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Last Name *</label>
                <input type="text" placeholder="Doe" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Address *</label>
              <input type="text" placeholder="123 Main St" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">City *</label>
                <input type="text" placeholder="New York" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">ZIP Code *</label>
                <input type="text" placeholder="10001" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Country *</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white appearance-none">
                <option>United States</option>
                <option>Nigeria</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Sweden</option>
              </select>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <i className="fas fa-credit-card text-blue-500"></i> Payment Method
          </h2>
          
          <div className="flex gap-4 mb-6">
            <label className="flex-1 border border-white/10 bg-white/5 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition">
              <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-blue-500" />
              <span className="text-white font-medium flex items-center gap-2">
                <i className="fas fa-credit-card text-blue-400"></i> Credit Card
              </span>
            </label>
            <label className="flex-1 border border-white/10 bg-white/5 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition">
              <input type="radio" name="payment" className="w-5 h-5 accent-blue-500" />
              <span className="text-white font-medium flex items-center gap-2">
                <i className="fab fa-paypal text-blue-400"></i> PayPal
              </span>
            </label>
          </div>

          <div className="space-y-5 bg-black/20 p-6 rounded-2xl border border-white/5 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Expiry Date</label>
                <input type="text" placeholder="MM/YY" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">CVV</label>
                <input type="text" placeholder="123" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition text-white font-mono" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <input type="checkbox" id="terms" required className="w-5 h-5 accent-blue-500 rounded border-gray-300" />
            <label htmlFor="terms" className="text-gray-400 text-sm">
              I agree to the Terms & Conditions and Privacy Policy
            </label>
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition text-lg flex justify-center items-center gap-2"
          >
            <i className="fas fa-lock"></i>
            {isProcessing ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary Sticky Sidebar */}
        <div className="lg:w-105">
          <div className="bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl sticky top-32">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <i className="fas fa-receipt text-blue-500"></i> Order Summary
            </h3>
            
            <div className="space-y-4 mb-6 text-gray-300">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-white font-medium text-lg">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className={`${shipping === 0 ? "text-green-400 font-bold" : "text-white"}`}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center text-yellow-500/90">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="h-1px bg-white/10 mb-6"></div>

            <div className="flex justify-between items-center text-2xl font-bold text-white mb-8">
              <span>Total</span>
              <span className="text-3xl">${total.toFixed(2)}</span>
            </div>

            <div className="bg-white/5 border border-emerald-500/30 rounded-xl p-5 flex items-start gap-4">
               <i className="fas fa-shield-alt text-3xl text-emerald-500 mt-1"></i>
               <div>
                  <strong className="text-white block mb-1">100% Secure Checkout</strong>
                  <span className="text-sm text-gray-400 leading-tight block">Your payment information is encrypted and securely processed.</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
