'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllOrders } from '../../lib/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllOrders().then((res) => {
            setOrders(res.data || []);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1d2a48]"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                    />
                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#56cfe1]">
                        <option>All Statuses</option>
                        <option>Completed</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Cancelled</option>
                    </select>
                </div>
                <button className="px-4 py-2 bg-[#1d2a48] text-white rounded-lg text-sm font-medium hover:bg-[#56cfe1] transition-colors">
                    Export CSV
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Order ID</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Customer</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Items</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Total</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-[#1d2a48]">#{order._id.slice(-6)}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-[#1d2a48]">{order.shippingAddress?.name || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{order.user?.email || 'No Account'}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">{order.items?.length || 0}</td>
                                <td className="px-6 py-4 font-medium">£{order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/orders/${order._id}`}
                                        className="text-[#56cfe1] hover:text-[#1d2a48] font-medium"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Showing 1 to {orders.length} of {orders.length} results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
