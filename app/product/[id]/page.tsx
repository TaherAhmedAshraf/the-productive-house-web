'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const productId = parseInt(params.id as string);
    const product = products.find(p => p.id === productId);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specs'>('description');

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#1d2a48] mb-4">Product Not Found</h1>
                        <Link href="/shop" className="text-[#56cfe1] hover:text-[#1d2a48]">
                            Back to Shop
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const images = product.images || [product.image];
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link href="/" className="hover:text-[#56cfe1]">Home</Link>
                            <span>/</span>
                            <Link href="/shop" className="hover:text-[#56cfe1]">Shop</Link>
                            <span>/</span>
                            <Link href={`/shop?category=${product.category}`} className="hover:text-[#56cfe1]">{product.category}</Link>
                            <span>/</span>
                            <span className="text-[#1d2a48] font-medium">{product.name}</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {/* Image Gallery */}
                        <div>
                            <div className="bg-white rounded-lg overflow-hidden mb-4 aspect-square">
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? 'border-[#56cfe1] scale-95'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            {product.badge && (
                                <span className="inline-block bg-[#56cfe1] text-white text-xs uppercase px-3 py-1 tracking-wider mb-4">
                                    {product.badge}
                                </span>
                            )}

                            <h1 className="text-3xl lg:text-4xl font-bold text-[#1d2a48] mb-4">{product.name}</h1>

                            {/* Rating */}
                            {product.rating && (
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {product.rating} ({product.reviews} reviews)
                                    </span>
                                </div>
                            )}

                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-4xl font-bold text-[#1d2a48]">£{product.price.toFixed(2)}</span>
                                {product.inStock ? (
                                    <span className="text-green-600 font-medium">In Stock</span>
                                ) : (
                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                )}
                            </div>

                            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

                            {/* Quantity and Add to Cart */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <label className="font-medium text-[#2c2823]">Quantity:</label>
                                    <div className="flex items-center border border-gray-300 rounded">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-6 py-2 border-x border-gray-300 font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock}
                                        className="flex-1 bg-[#1d2a48] text-white py-4 text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                                    >
                                        Add to Cart
                                    </button>
                                    <button className="px-6 border-2 border-[#1d2a48] text-[#1d2a48] hover:bg-gray-50 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <span>Free shipping on orders over £40</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>30-day return policy</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-lg shadow-sm mb-16">
                        <div className="border-b border-gray-200">
                            <div className="flex gap-8 px-6">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`py-4 border-b-2 transition-colors ${activeTab === 'description'
                                            ? 'border-[#56cfe1] text-[#1d2a48] font-medium'
                                            : 'border-transparent text-gray-600 hover:text-[#1d2a48]'
                                        }`}
                                >
                                    Description
                                </button>
                                {product.features && (
                                    <button
                                        onClick={() => setActiveTab('features')}
                                        className={`py-4 border-b-2 transition-colors ${activeTab === 'features'
                                                ? 'border-[#56cfe1] text-[#1d2a48] font-medium'
                                                : 'border-transparent text-gray-600 hover:text-[#1d2a48]'
                                            }`}
                                    >
                                        Features
                                    </button>
                                )}
                                {product.specifications && (
                                    <button
                                        onClick={() => setActiveTab('specs')}
                                        className={`py-4 border-b-2 transition-colors ${activeTab === 'specs'
                                                ? 'border-[#56cfe1] text-[#1d2a48] font-medium'
                                                : 'border-transparent text-gray-600 hover:text-[#1d2a48]'
                                            }`}
                                    >
                                        Specifications
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {activeTab === 'description' && (
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {activeTab === 'features' && product.features && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {product.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-[#56cfe1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'specs' && product.specifications && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between border-b border-gray-200 pb-3">
                                            <span className="font-medium text-[#2c2823] capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </span>
                                            <span className="text-gray-700">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-[#1d2a48] mb-6">You May Also Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/product/${relatedProduct.id}`}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                                    >
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={relatedProduct.image}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-[#2c2823] mb-2 line-clamp-2">{relatedProduct.name}</h3>
                                            <p className="text-[#1d2a48] font-bold">£{relatedProduct.price.toFixed(2)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
