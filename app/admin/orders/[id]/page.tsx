'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { userOrders, Order } from '../../../data/orders';

export default function AdminOrderDetails() {
    const params = useParams();
    const router = useRouter();
    const orderId = decodeURIComponent(params.id as string).replace('#', '');

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        // Simulate fetching order
        const foundOrder = userOrders.find(o => o.id === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
            setStatus(foundOrder.status);
        }
        setLoading(false);
    }, [orderId]);

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        // In a real app, you would make an API call here to update the order status
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d2a48]"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
                <p className="text-gray-500 mt-2">The order #{orderId} could not be found.</p>
                <Link href="/admin/orders" className="text-[#56cfe1] hover:underline mt-4 inline-block">
                    &larr; Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1d2a48] flex items-center gap-3">
                            Order #{order.id}
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                        status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-red-100 text-red-800'
                                }`}>
                                {status}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-[#56cfe1]"
                        >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-[#1d2a48] text-white rounded-lg text-sm font-medium hover:bg-[#56cfe1] transition-colors">
                        Print Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-[#1d2a48]">Order Items</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="p-6 flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-[#1d2a48]">{item.name}</h4>
                                        <p className="text-sm text-gray-500">Unit Price: £{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-[#1d2a48]">Qty: {item.quantity}</p>
                                        <p className="font-bold text-[#1d2a48]">£{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">£{(order.total * 0.8).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">£5.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-4">
                                <span className="text-gray-600">Tax (20%)</span>
                                <span className="font-medium">£{(order.total * 0.2).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-[#1d2a48] pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>£{order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-[#1d2a48] mb-4">Timeline</h3>
                        <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#56cfe1] ring-4 ring-white"></div>
                                <p className="font-medium text-[#1d2a48]">Order Placed</p>
                                <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            {order.status !== 'Processing' && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#56cfe1] ring-4 ring-white"></div>
                                    <p className="font-medium text-[#1d2a48]">Payment Confirmed</p>
                                    <p className="text-sm text-gray-500">{order.date}</p>
                                </div>
                            )}
                            {['Shipped', 'Delivered'].includes(order.status) && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#56cfe1] ring-4 ring-white"></div>
                                    <p className="font-medium text-[#1d2a48]">Order Shipped</p>
                                    <p className="text-sm text-gray-500">Tracking: {order.trackingNumber || 'N/A'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-[#1d2a48] mb-4">Customer</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d2a48] font-bold">
                                {order.shippingAddress.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-[#1d2a48]">{order.shippingAddress.name}</p>
                                <p className="text-sm text-[#56cfe1]">View Profile</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span className="text-gray-600">customer@example.com</span>
                            </div>
                            <div className="flex gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span className="text-gray-600">+44 7700 900000</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-[#1d2a48] mb-4">Shipping Address</h3>
                        <address className="not-italic text-sm text-gray-600 space-y-1">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}</p>
                            <p>{order.shippingAddress.postcode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </address>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-[#1d2a48] mb-4">Payment</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span className="font-medium text-[#1d2a48]">Method:</span>
                            {order.paymentMethod}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-[#1d2a48]">Status:</span>
                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">Paid</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
