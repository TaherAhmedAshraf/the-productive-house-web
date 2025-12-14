'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user } = useAuth();

  return (
    <>
      <div className="announcement-bar bg-[#1d2a48] text-white py-2 text-center text-sm">
        <p>Over 150,000 planners sold | Free UK shipping when you spend £40</p>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 lg:h-[101px]">
            <button
              className="lg:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>

            <nav className="hidden lg:flex space-x-8 text-sm uppercase tracking-wider">
              <Link href="/shop" className="hover:text-[#56cfe1] transition-colors">Shop</Link>
              <Link href="/shop?category=Planners" className="hover:text-[#56cfe1] transition-colors">Planners</Link>
              <Link href="/about" className="hover:text-[#56cfe1] transition-colors">About</Link>
            </nav>

            <Link href="/" className="text-2xl font-serif font-bold tracking-tight">
              Productivity Method
            </Link>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-[#56cfe1] transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <Link
                href={user ? "/profile" : "/login"}
                className="hover:text-[#56cfe1] transition-colors"
                aria-label={user ? "Profile" : "Login"}
              >
                {user ? (
                  <div className="w-5 h-5 rounded-full bg-[#1d2a48] text-white flex items-center justify-center text-xs">
                    {user.email?.[0].toUpperCase()}
                  </div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="hover:text-[#56cfe1] transition-colors relative"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#56cfe1] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-slow">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white slide-down">
            <nav className="flex flex-col p-4 space-y-4">
              <Link href="/shop" className="text-sm uppercase tracking-wider hover:text-[#56cfe1]">Shop</Link>
              <Link href="/shop?category=Planners" className="text-sm uppercase tracking-wider hover:text-[#56cfe1]">Planners</Link>
              <Link href="/about" className="text-sm uppercase tracking-wider hover:text-[#56cfe1]">About</Link>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

