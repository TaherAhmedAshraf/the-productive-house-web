'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
    const { cart, removeFromCart, updateQuantity, cartCount, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isCartOpen) {
            setShouldRender(true);
            // Small delay to trigger animation
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            // Wait for animation to complete before unmounting
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [isCartOpen]);

    const handleClose = () => {
        setIsCartOpen(false);
    };

    if (!shouldRender) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#1d2a48] to-[#2a3f5f] text-white">
                    <h2 className="text-xl font-bold">Shopping Cart ({cartCount})</h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-[#56cfe1] transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="mb-4 animate-bounce-slow">
                                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 mb-4">Your cart is empty</p>
                            <button
                                onClick={handleClose}
                                className="text-[#56cfe1] hover:text-[#1d2a48] transition-colors font-medium"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`flex gap-4 pb-4 border-b border-gray-100 animate-slide-in-right`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="relative group">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-24 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded"></div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-[#2c2823] mb-1">{item.name}</h3>
                                        <p className="text-[#696969] text-sm mb-2">£{item.price.toFixed(2)}</p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-7 h-7 border border-gray-300 rounded hover:bg-[#1d2a48] hover:text-white hover:border-[#1d2a48] transition-all duration-200"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 border border-gray-300 rounded hover:bg-[#1d2a48] hover:text-white hover:border-[#1d2a48] transition-all duration-200"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="ml-auto text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50 animate-slide-up">
                        <div className="flex justify-between mb-4">
                            <span className="font-medium text-[#2c2823]">Subtotal</span>
                            <span className="font-bold text-[#1d2a48] text-lg">£{cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>

                        <Link
                            href="/cart"
                            onClick={handleClose}
                            className="block w-full bg-white border-2 border-[#1d2a48] text-[#1d2a48] text-center py-3 mb-2 text-sm uppercase tracking-wider hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                        >
                            View Cart
                        </Link>

                        <Link
                            href="/checkout"
                            onClick={handleClose}
                            className="block w-full bg-[#1d2a48] text-white text-center py-3 text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
