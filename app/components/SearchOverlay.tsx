'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { products } from '../data/products';
import { Product } from '../types/product';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsAnimating(true), 10);
            // Focus input after animation
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            setIsAnimating(false);
            setTimeout(() => setShouldRender(false), 300);
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setResults([]);
            return;
        }

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filtered);
    }, [searchTerm]);

    const handleClose = () => {
        onClose();
        setSearchTerm('');
    };

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={handleClose}
            />

            {/* Search Modal */}
            <div
                className={`relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
                    }`}
            >
                {/* Search Header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products, categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 text-lg outline-none placeholder:text-gray-400 text-[#1d2a48]"
                    />
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {searchTerm === '' ? (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">Start typing to search across our store</p>
                            <div className="mt-6">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Popular Searches</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['Planners', 'Journals', '2024', 'Pens'].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setSearchTerm(term)}
                                            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-600 transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No products found for "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            <p className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                                Products ({results.length})
                            </p>
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    onClick={handleClose}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-[#1d2a48] group-hover:text-[#56cfe1] transition-colors">
                                            {product.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-[#1d2a48]">£{product.price.toFixed(2)}</span>
                                        {product.badge && (
                                            <span className="block text-[10px] uppercase tracking-wider text-[#56cfe1] font-medium mt-1">
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
