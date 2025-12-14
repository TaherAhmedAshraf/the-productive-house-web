'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id;
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Mock initial data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
    });

    useEffect(() => {
        // Simulate fetching product details
        setTimeout(() => {
            setFormData({
                name: 'Daily Planner 2025',
                description: 'The ultimate daily planner for productivity enthusiasts.',
                price: '29.99',
                stock: '150',
                category: 'Planners',
            });
            setDataLoaded(true);
        }, 500);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/admin/products');
        }, 1000);
    };

    if (!dataLoaded) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d2a48]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#1d2a48]">Edit Product: #{productId}</h1>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-[#1d2a48] text-white rounded-lg hover:bg-[#56cfe1] transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : 'Update Product'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#1d2a48] mb-4">General Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    defaultValue={formData.name}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={5}
                                    defaultValue={formData.description}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    {/* ... keeping it brief for demo ... */}
                </div>
            </div>
        </div>
    );
}
