"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { CartContext } from "./Providers";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const cartContext = useContext(CartContext);
  const cartCount = cartContext?.cartCount ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);

  const isAccountPage = pathname === "/account";
  const isLoggedIn = status === "authenticated";

  // Hide navbar on account page
  if (isAccountPage) {
    return null;
  }

  return (
    <nav className="navbar sticky-glass px-6 md:px-12 py-4 md:py-6 flex justify-between items-center z-50 transition-all duration-500">
      <Link href="/" className="logo">
        <img src="/images/logo-white.png" alt="Redstore Logo" width="150" className="cursor-pointer" />
      </Link>

      {/* Hamburger Menu Button - Mobile Only */}
      <button
        className="mobile-menu-btn block lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        <div className={`hamburger-icon ${menuOpen ? "open" : ""}`}>
          <span className="bg-white"></span>
          <span className="bg-white"></span>
          <span className="bg-white"></span>
        </div>
      </button>

      {/* Nav Links */}
      <ul className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <li><Link href="/" onClick={() => setMenuOpen(false)} className="nav-link-anim text-white font-medium hover:text-blue-400">Home</Link></li>
        <li><Link href="/products" onClick={() => setMenuOpen(false)} className="nav-link-anim text-white font-medium hover:text-blue-400">Products</Link></li>
        <li><Link href="/about" onClick={() => setMenuOpen(false)} className="nav-link-anim text-white font-medium hover:text-blue-400">About</Link></li>
        <li><Link href="/contact" onClick={() => setMenuOpen(false)} className="nav-link-anim text-white font-medium hover:text-blue-400">Contact</Link></li>
        <li>
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="relative text-2xl flex items-center">
            <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white p-1 rounded-full text-[10px] absolute -top-2 -right-3 transition-transform">{cartCount}</span>
            <i className="fa fa-shopping-cart text-white text-xl"></i>
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {session?.user?.image && (
                <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border border-white/20" loading="lazy" />
              )}
              <button 
                onClick={() => { signOut(); setMenuOpen(false); }} 
                className="btn px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 transition rounded-lg text-sm font-bold text-white"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/account" onClick={() => setMenuOpen(false)} className="btn px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-sm font-bold text-white">
              Sign In
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
