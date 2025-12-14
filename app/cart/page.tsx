'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const shippingCost = cartTotal >= 40 ? 0 : 4.99;
    const finalTotal = cartTotal + shippingCost - discount;

    const applyPromoCode = () => {
        // Simple promo code logic - can be expanded
        if (promoCode.toUpperCase() === 'SAVE10') {
            setDiscount(cartTotal * 0.1);
        } else {
            alert('Invalid promo code');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#1d2a48] mb-8">Shopping Cart</h1>

                    {cart.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-[#2c2823] mb-4">Your cart is empty</h2>
                            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
                            <Link
                                href="/"
                                className="inline-block bg-[#1d2a48] text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    {/* Table Header - Hidden on mobile */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-600 uppercase tracking-wider">
                                        <div className="col-span-6">Product</div>
                                        <div className="col-span-2 text-center">Price</div>
                                        <div className="col-span-2 text-center">Quantity</div>
                                        <div className="col-span-2 text-right">Total</div>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="divide-y divide-gray-200">
                                        {cart.map((item) => (
                                            <div key={item.id} className="p-6">
                                                <div className="grid md:grid-cols-12 gap-4 items-center">
                                                    {/* Product Info */}
                                                    <div className="md:col-span-6 flex gap-4">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-24 h-32 object-cover rounded"
                                                        />
                                                        <div className="flex flex-col justify-center">
                                                            <h3 className="font-medium text-[#2c2823] mb-1">{item.name}</h3>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-red-500 hover:text-red-700 transition-colors text-sm text-left"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="md:col-span-2 text-left md:text-center">
                                                        <span className="md:hidden font-medium text-gray-600 mr-2">Price:</span>
                                                        <span className="text-[#696969]">£{item.price.toFixed(2)}</span>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                                                        <span className="md:hidden font-medium text-gray-600 mr-2">Quantity:</span>
                                                        <div className="flex items-center gap-2 border border-gray-300 rounded">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-12 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Total */}
                                                    <div className="md:col-span-2 text-left md:text-right">
                                                        <span className="md:hidden font-medium text-gray-600 mr-2">Total:</span>
                                                        <span className="font-bold text-[#1d2a48]">£{(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Continue Shopping */}
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 mt-6 text-[#56cfe1] hover:text-[#1d2a48] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                    <h2 className="text-xl font-bold text-[#1d2a48] mb-6">Order Summary</h2>

                                    {/* Promo Code */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="Enter code"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                            />
                                            <button
                                                onClick={applyPromoCode}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    {/* Summary Details */}
                                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="text-[#2c2823]">£{cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-[#2c2823]">
                                                {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                                            </span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-600">Discount</span>
                                                <span className="text-green-600">-£{discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {cartTotal < 40 && (
                                            <p className="text-xs text-[#56cfe1]">
                                                Add £{(40 - cartTotal).toFixed(2)} more for free shipping!
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-between mb-6">
                                        <span className="font-bold text-[#2c2823]">Total</span>
                                        <span className="font-bold text-[#1d2a48] text-xl">£{finalTotal.toFixed(2)}</span>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="block w-full bg-[#1d2a48] text-white text-center py-3 rounded text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-colors mb-3"
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Secure Checkout
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
