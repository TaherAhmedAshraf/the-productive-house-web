'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
    // Contact Information
    email: string;

    // Shipping Address
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;

    // Payment (simplified - in production use Stripe/PayPal)
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;

    // Options
    saveInfo: boolean;
    sameAsShipping: boolean;
}

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Information, 2: Shipping, 3: Payment
    const [formData, setFormData] = useState<FormData>({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        postalCode: '',
        country: 'United Kingdom',
        phone: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveInfo: false,
        sameAsShipping: true,
    });

    const shippingCost = cartTotal >= 40 ? 0 : 4.99;
    const tax = cartTotal * 0.2; // 20% VAT
    const finalTotal = cartTotal + shippingCost + tax;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (step < 3) {
            setStep(step + 1);
        } else {
            // Process payment (in production, integrate with payment gateway)
            alert('Order placed successfully! (Demo mode)');
            clearCart();
            router.push('/');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 bg-gray-50 py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl font-bold text-[#1d2a48] mb-4">Your cart is empty</h1>
                        <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
                        <a
                            href="/"
                            className="inline-block bg-[#1d2a48] text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-colors"
                        >
                            Continue Shopping
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Progress Steps */}
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="flex items-center justify-between">
                            {[
                                { num: 1, label: 'Information' },
                                { num: 2, label: 'Shipping' },
                                { num: 3, label: 'Payment' },
                            ].map((s, idx) => (
                                <div key={s.num} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s.num
                                                    ? 'bg-[#1d2a48] text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            {s.num}
                                        </div>
                                        <span className="text-xs mt-2 text-gray-600">{s.label}</span>
                                    </div>
                                    {idx < 2 && (
                                        <div
                                            className={`h-1 flex-1 mx-2 transition-colors ${step > s.num ? 'bg-[#1d2a48]' : 'bg-gray-200'
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                                <form onSubmit={handleSubmit}>
                                    {/* Step 1: Contact Information */}
                                    {step === 1 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-[#1d2a48] mb-6">Contact Information</h2>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Email Address *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                            placeholder="you@example.com"
                                                        />
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            name="saveInfo"
                                                            checked={formData.saveInfo}
                                                            onChange={handleInputChange}
                                                            className="w-4 h-4 text-[#56cfe1] border-gray-300 rounded focus:ring-[#56cfe1]"
                                                        />
                                                        <label className="ml-2 text-sm text-gray-600">
                                                            Email me with news and offers
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h2 className="text-2xl font-bold text-[#1d2a48] mb-6">Shipping Address</h2>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            First Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Last Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Address *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Apartment, suite, etc. (optional)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="apartment"
                                                            value={formData.apartment}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            City *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="city"
                                                            value={formData.city}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Postal Code *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="postalCode"
                                                            value={formData.postalCode}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Country *
                                                        </label>
                                                        <select
                                                            name="country"
                                                            value={formData.country}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        >
                                                            <option>United Kingdom</option>
                                                            <option>United States</option>
                                                            <option>Canada</option>
                                                            <option>Australia</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Phone *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Shipping Method */}
                                    {step === 2 && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-[#1d2a48] mb-6">Shipping Method</h2>

                                            <div className="space-y-3">
                                                <div className="border-2 border-[#56cfe1] rounded-lg p-4 bg-blue-50">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="shipping"
                                                                checked
                                                                readOnly
                                                                className="w-4 h-4 text-[#56cfe1]"
                                                            />
                                                            <div className="ml-3">
                                                                <p className="font-medium text-[#2c2823]">Standard Shipping</p>
                                                                <p className="text-sm text-gray-600">5-7 business days</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-bold text-[#1d2a48]">
                                                            {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="border border-gray-300 rounded-lg p-4 opacity-50">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="shipping"
                                                                disabled
                                                                className="w-4 h-4"
                                                            />
                                                            <div className="ml-3">
                                                                <p className="font-medium text-[#2c2823]">Express Shipping</p>
                                                                <p className="text-sm text-gray-600">2-3 business days</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-bold text-[#1d2a48]">£9.99</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Payment */}
                                    {step === 3 && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-[#1d2a48] mb-6">Payment Information</h2>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                                <p className="text-sm text-yellow-800">
                                                    <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed.
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Card Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="1234 5678 9012 3456"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Name on Card *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cardName"
                                                        value={formData.cardName}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Expiry Date *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="expiryDate"
                                                            value={formData.expiryDate}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder="MM/YY"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            CVV *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="cvv"
                                                            value={formData.cvv}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder="123"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center pt-4">
                                                <input
                                                    type="checkbox"
                                                    name="sameAsShipping"
                                                    checked={formData.sameAsShipping}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-[#56cfe1] border-gray-300 rounded focus:ring-[#56cfe1]"
                                                />
                                                <label className="ml-2 text-sm text-gray-600">
                                                    Billing address same as shipping
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                                        {step > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setStep(step - 1)}
                                                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
                                            >
                                                Back
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="flex-1 bg-[#1d2a48] text-white py-3 rounded text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-colors"
                                        >
                                            {step === 3 ? 'Place Order' : 'Continue'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-[#1d2a48] mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-20 object-cover rounded"
                                                />
                                                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-[#2c2823]">{item.name}</h3>
                                                <p className="text-sm text-gray-600">£{item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="text-sm font-medium text-[#2c2823]">
                                                £{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
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
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax (VAT 20%)</span>
                                        <span className="text-[#2c2823]">£{tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between mb-6">
                                    <span className="font-bold text-[#2c2823]">Total</span>
                                    <span className="font-bold text-[#1d2a48] text-xl">£{finalTotal.toFixed(2)}</span>
                                </div>

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
            </main>

            <Footer />
        </div>
    );
}
