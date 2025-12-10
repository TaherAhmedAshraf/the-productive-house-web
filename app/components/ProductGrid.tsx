'use client';

import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  badge?: string;
}

export default function ProductGrid() {
  const products: Product[] = [
    {
      id: 1,
      name: 'Daily Planner 2024',
      price: 29.99,
      image: 'https://images.pexels.com/photos/6373478/pexels-photo-6373478.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Goal Setting Journal',
      price: 24.99,
      image: 'https://images.pexels.com/photos/4207707/pexels-photo-4207707.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      name: 'Weekly Productivity Planner',
      price: 34.99,
      image: 'https://images.pexels.com/photos/6373305/pexels-photo-6373305.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'New'
    },
    {
      id: 4,
      name: 'Habit Tracker',
      price: 19.99,
      image: 'https://images.pexels.com/photos/4207891/pexels-photo-4207891.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 5,
      name: 'Monthly Planner Set',
      price: 44.99,
      image: 'https://images.pexels.com/photos/6373285/pexels-photo-6373285.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 6,
      name: 'Minimalist Notebook',
      price: 16.99,
      image: 'https://images.pexels.com/photos/4207909/pexels-photo-4207909.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 7,
      name: 'Professional Planner',
      price: 39.99,
      image: 'https://images.pexels.com/photos/6373488/pexels-photo-6373488.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 8,
      name: 'Wellness Journal',
      price: 27.99,
      image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
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
            <button className="bg-white text-[#1d2a48] px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#56cfe1] hover:text-white transition-colors duration-300">
              Quick View
            </button>
          )}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-sm font-medium text-[#2c2823] mb-2">{product.name}</h3>
        <p className="text-[#696969] font-bold">£{product.price.toFixed(2)}</p>
      </div>

      <button className="w-full mt-4 border border-[#1d2a48] text-[#1d2a48] py-3 text-sm uppercase tracking-wider hover:bg-[#1d2a48] hover:text-white transition-colors duration-300">
        Add to Cart
      </button>
    </div>
  );
}
