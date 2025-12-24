'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, updateProduct } from '../../../../lib/api';
import ImageUpload from '../../../../components/admin/ImageUpload';

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: '',
    });

    useEffect(() => {
        if (productId) {
            getProduct(productId).then((response) => {
                if (response && response.data) {
                    const product = response.data;
                    setFormData({
                        name: product.name || '',
                        description: product.description || '',
                        price: product.price?.toString() || '',
                        stock: product.stock?.toString() || '',
                        category: product.category || '',
                        image: product.image || '',
                    });
                }
                setLoading(false);
            }).catch(err => {
                console.error(err);
                alert('Failed to load product');
                router.push('/admin/products');
            });
        }
    }, [productId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUploadComplete = (url: string) => {
        setFormData({ ...formData, image: url });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.stock || !formData.category || !formData.image) {
            alert('Please fill in all required fields including the product image');
            return;
        }

        setSaving(true);
        try {
            await updateProduct(productId, {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category: formData.category,
                image: formData.image,
                images: [formData.image],
            });

            alert('Product updated successfully!');
            router.push('/admin/products');
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Failed to update product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1d2a48]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#1d2a48]">Edit Product</h1>
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
                        disabled={saving}
                        className="px-4 py-2 bg-[#1d2a48] text-white rounded-lg hover:bg-[#56cfe1] transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {saving && (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {saving ? 'Saving...' : 'Update Product'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#1d2a48] mb-4">General Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                    placeholder="e.g. Daily Planner 2025"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                    placeholder="Enter product description..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#1d2a48] mb-4">Pricing & Inventory</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Base Price (£) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                    placeholder="29.99"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                                    placeholder="100"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Organization & Images */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#1d2a48] mb-4">Product Image <span className="text-red-500">*</span></h2>
                        <ImageUpload onUploadComplete={handleUploadComplete} currentImage={formData.image} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#1d2a48] mb-4">Category</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                            >
                                <option value="">Select Category</option>
                                <option value="Planners">Planners</option>
                                <option value="Journals">Journals</option>
                                <option value="Notebooks">Notebooks</option>
                                <option value="Stationery">Stationery</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
