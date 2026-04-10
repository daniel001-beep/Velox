"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <Link href="/">
              <img
                src="/images/logo-white.png"
                alt="RedStore"
                className="h-10 mb-8 hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-xs">
              Elevating your lifestyle with premium sportswear and essentials. Quality meets comfort since 2024.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-400 hover:border-blue-400 transition-all">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-blue-400 transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link href="/cart" className="text-gray-400 hover:text-blue-400 transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <span className="text-gray-400 text-sm">Gwagwalada, Abuja, Nigeria</span>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <i className="fas fa-phone"></i>
                </div>
                <span className="text-gray-400 text-sm">+234 701 175 5321</span>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <span className="text-gray-400 text-sm">support@redstore.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © 2026 RedStore Premium. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all cursor-help" />
          </div>
        </div>
      </div>
    </footer>
  );
}
