'use client';

import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { products } from '../data/products';
import { CATEGORIES, Category } from '../types/product';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name' | 'rating';

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('All Products');
    const [sortBy, setSortBy] = useState<SortOption>('featured');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const { addToCart } = useCart();

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const categoryMatch = selectedCategory === 'All Products' || product.category === selectedCategory;
            const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
            return categoryMatch && priceMatch;
        });

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                // Featured - keep original order
                break;
        }

        return filtered;
    }, [selectedCategory, sortBy, priceRange]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#1d2a48] to-[#2a3f5f] text-white py-16">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Shop Our Collection</h1>
                        <p className="text-lg text-gray-200 max-w-2xl">
                            Discover premium planners, journals, and productivity tools designed to help you achieve your goals.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-[#1d2a48] mb-6">Filters</h2>

                                {/* Category Filter */}
                                <div className="mb-8">
                                    <h3 className="font-medium text-[#2c2823] mb-4">Category</h3>
                                    <div className="space-y-2">
                                        {CATEGORIES.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`block w-full text-left px-4 py-2 rounded transition-colors ${selectedCategory === category
                                                        ? 'bg-[#1d2a48] text-white'
                                                        : 'hover:bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-8">
                                    <h3 className="font-medium text-[#2c2823] mb-4">Price Range</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                className="w-full accent-[#56cfe1]"
                                            />
                                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                                <span>£{priceRange[0]}</span>
                                                <span>£{priceRange[1]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* In Stock Only */}
                                <div className="mb-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-4 h-4 text-[#56cfe1] border-gray-300 rounded focus:ring-[#56cfe1]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                                    </label>
                                </div>

                                {/* Reset Filters */}
                                <button
                                    onClick={() => {
                                        setSelectedCategory('All Products');
                                        setPriceRange([0, 100]);
                                        setSortBy('featured');
                                    }}
                                    className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors text-sm"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            {/* Sort and Results Count */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <p className="text-gray-600">
                                    Showing <span className="font-medium text-[#1d2a48]">{filteredProducts.length}</span> products
                                </p>

                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-600">Sort by:</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name">Name: A to Z</option>
                                        <option value="rating">Highest Rated</option>
                                    </select>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {filteredProducts.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-[#2c2823] mb-2">No products found</h3>
                                    <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('All Products');
                                            setPriceRange([0, 100]);
                                        }}
                                        className="text-[#56cfe1] hover:text-[#1d2a48] transition-colors font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ProductCard({ product, onAddToCart }: { product: any; onAddToCart: any }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {product.badge && (
                    <span className="absolute top-4 left-4 bg-[#1d2a48] text-white text-xs uppercase px-3 py-1 tracking-wider">
                        {product.badge}
                    </span>
                )}

                {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-[#1d2a48] px-4 py-2 font-bold">Out of Stock</span>
                    </div>
                )}
            </Link>

            <div className="p-4">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium text-[#2c2823] mb-2 hover:text-[#56cfe1] transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mb-2">
                    {product.rating && (
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-gray-600">({product.reviews})</span>
                        </div>
                    )}
                </div>

                <p className="text-[#1d2a48] font-bold text-lg mb-3">£{product.price.toFixed(2)}</p>

                <div className="flex gap-2">
                    <Link
                        href={`/product/${product.id}`}
                        className="flex-1 border border-[#1d2a48] text-[#1d2a48] text-center py-2 text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
                    >
                        View Details
                    </Link>
                    <button
                        onClick={() => onAddToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                        })}
                        disabled={!product.inStock}
                        className="flex-1 bg-[#1d2a48] text-white py-2 text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
