'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import Link from 'next/link';

export default function ProductGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1d2a48] mb-4">Our Collection</h2>
          <p className="text-[#696969] max-w-2xl mx-auto">
            Thoughtfully designed productivity tools to help you plan your perfect day
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block bg-[#1d2a48] text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
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

        <div className={`absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 flex items-center justify-center ${isHovered ? 'bg-opacity-20' : ''}`}>
          {isHovered && (
            <span className="bg-white text-[#1d2a48] px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#56cfe1] hover:text-white transition-colors duration-300">
              Quick View
            </span>
          )}
        </div>
      </Link>

      <div className="text-center">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-[#2c2823] mb-2 hover:text-[#56cfe1] transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center justify-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        )}

        <p className="text-[#696969] font-bold mb-3">£{product.price.toFixed(2)}</p>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full mt-4 border border-[#1d2a48] text-[#1d2a48] py-3 text-sm uppercase tracking-wider hover:bg-[#1d2a48] hover:text-white transition-colors duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
}
