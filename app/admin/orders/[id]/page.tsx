'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrder, updateOrderStatus } from '../../../lib/api';

export default function AdminOrderDetails() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string>('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (orderId) {
            getOrder(orderId).then((data) => {
                if (data) {
                    setOrder(data);
                    setStatus(data.status);
                }
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [orderId]);

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            setStatus(newStatus);
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const handlePrint = () => {
        window.print();
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
        <>
            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

            <div className="max-w-5xl mx-auto">
                {/* Screen Header - Hidden on Print */}
                <div className="flex items-center justify-between mb-6 no-print">
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
                                Order #{order._id?.slice(-6) || 'N/A'}
                                <span className={`text-sm px-3 py-1 rounded-full font-medium ${status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {status}
                                </span>
                            </h1>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={updating}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-[#56cfe1] disabled:opacity-50"
                            >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-[#1d2a48] text-white rounded-lg text-sm font-medium hover:bg-[#56cfe1] transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Invoice
                        </button>
                    </div>
                </div>

                {/* Invoice Content - Printable */}
                <div id="invoice-content">
                    {/* Print Header - Only visible when printing */}
                    <div className="print-only mb-8">
                        <div className="flex justify-between items-start border-b-2 border-[#1d2a48] pb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1d2a48]">INVOICE</h1>
                                <p className="text-gray-600 mt-2">The Productive House</p>
                                <p className="text-sm text-gray-500">productivity@example.com</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Order ID</p>
                                <p className="text-lg font-bold text-[#1d2a48]">#{order._id?.slice(-6)}</p>
                                <p className="text-sm text-gray-600 mt-2">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
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
                                    {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="p-6 flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 no-print">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-[#1d2a48]">{item.name}</h4>
                                                <p className="text-sm text-gray-500">Unit Price: £{item.price?.toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-[#1d2a48]">Qty: {item.quantity}</p>
                                                <p className="font-bold text-[#1d2a48]">£{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-lg font-bold text-[#1d2a48] pt-4 border-t-2 border-[#1d2a48]">
                                        <span>Total</span>
                                        <span>£{order.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Customer Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-[#1d2a48] mb-4">Customer</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1d2a48] font-bold no-print">
                                        {order.shippingAddress?.name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#1d2a48]">{order.shippingAddress?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{order.user?.email || 'No Account'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-[#1d2a48] mb-4">Shipping Address</h3>
                                <address className="not-italic text-sm text-gray-600 space-y-1">
                                    <p>{order.shippingAddress?.street}</p>
                                    <p>{order.shippingAddress?.city}</p>
                                    <p>{order.shippingAddress?.zip}</p>
                                    <p>{order.shippingAddress?.country}</p>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
