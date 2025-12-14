'use client';

import { useCart } from '../context/CartContext';

export default function CartToast() {
    const { showToast, toastMessage } = useCart();

    if (!showToast) return null;

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
            <div className="bg-[#1d2a48] text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md">
                <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-[#56cfe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span className="flex-1 font-medium">{toastMessage}</span>
                <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-[#56cfe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
