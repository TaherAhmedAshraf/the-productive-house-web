'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { userOrders } from '../../../data/orders';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    // Find the order
    const order = userOrders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#1d2a48] mb-2">Order Not Found</h1>
                        <p className="text-gray-500 mb-6">We couldn't find the order you're looking for.</p>
                        <Link href="/profile" className="px-6 py-2 bg-[#1d2a48] text-white rounded-lg hover:bg-[#56cfe1] transition-colors">
                            Back to Profile
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb / Back Navigation */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-sm text-gray-500 hover:text-[#1d2a48] mb-6 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Orders
                    </button>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        {/* Order Header */}
                        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#1d2a48] flex items-center gap-3">
                                    Order #{order.id}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </h1>
                                <p className="text-gray-500 mt-1">Placed on {order.date}</p>
                            </div>

                            <div className="text-right">
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                    Download Invoice
                                </button>
                            </div>
                        </div>

                        {/* Tracking Info (if available) */}
                        {order.trackingNumber && (
                            <div className="px-6 md:px-8 py-4 bg-[#f0f9fa] border-b border-[#e0f2f5] flex items-center gap-3">
                                <svg className="w-5 h-5 text-[#56cfe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                <p className="text-sm text-[#1d2a48]">
                                    Tracking Number: <span className="font-mono font-medium">{order.trackingNumber}</span>
                                </p>
                                <a href="#" className="text-sm font-medium text-[#56cfe1] hover:underline ml-auto">
                                    Track Package &rarr;
                                </a>
                            </div>
                        )}

                        <div className="grid md:grid-cols-3 gap-0">
                            {/* Order Items */}
                            <div className="md:col-span-2 p-6 md:p-8 border-r border-gray-100">
                                <h2 className="font-bold text-[#1d2a48] mb-6">Items Ordered</h2>
                                <div className="space-y-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-[#1d2a48]">{item.name}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                                                    </div>
                                                    <span className="font-medium text-[#1d2a48]">£{item.price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">£{(order.total - 15).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">£5.00</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">£10.00</span>
                                    </div>
                                    <div className="flex justify-between py-3 mt-2 border-t border-gray-100 text-lg font-bold text-[#1d2a48]">
                                        <span>Total</span>
                                        <span>£{order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Info Sidebar */}
                            <div className="p-6 md:p-8 bg-gray-50/30 space-y-8">
                                <div>
                                    <h3 className="font-bold text-[#1d2a48] mb-3">Shipping Address</h3>
                                    <address className="not-italic text-sm text-gray-600 space-y-1">
                                        <p className="font-medium text-[#1d2a48]">{order.shippingAddress.name}</p>
                                        <p>{order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </address>
                                </div>

                                <div>
                                    <h3 className="font-bold text-[#1d2a48] mb-3">Billing Address</h3>
                                    <p className="text-sm text-gray-600">Same as shipping address</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-[#1d2a48] mb-3">Payment Method</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2 10h20v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9zm20-2V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2h20z" />
                                        </svg>
                                        {order.paymentMethod}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="font-bold text-[#1d2a48] mb-3">Need Help?</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Questions about your order? We're here to help.
                                    </p>
                                    <Link href="/contact" className="text-sm font-medium text-[#56cfe1] hover:underline">
                                        Contact Support
                                    </Link>
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
