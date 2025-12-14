'use client';

import Link from 'next/link';

export default function AdminOrders() {
    const orders = [
        { id: '#ORD-7821', customer: 'Sarah Miller', date: '2025-12-10', total: '£145.00', status: 'Completed', items: 3 },
        { id: '#ORD-7820', customer: 'James Thompson', date: '2025-12-10', total: '£32.50', status: 'Processing', items: 1 },
        { id: '#ORD-7819', customer: 'Emily Wilson', date: '2025-12-09', total: '£89.99', status: 'Shipped', items: 2 },
        { id: '#ORD-7818', customer: 'Michael Chen', date: '2025-12-08', total: '£210.00', status: 'Completed', items: 5 },
        { id: '#ORD-7817', customer: 'Jessica Brown', date: '2025-12-08', total: '£45.00', status: 'Cancelled', items: 1 },
        { id: '#ORD-7816', customer: 'David Garcia', date: '2025-12-07', total: '£67.50', status: 'Completed', items: 2 },
    ];

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
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-[#1d2a48]">{order.id}</td>
                                <td className="px-6 py-4">{order.customer}</td>
                                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                <td className="px-6 py-4">{order.items}</td>
                                <td className="px-6 py-4 font-medium">{order.total}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/orders/${order.id.replace('#', '')}`}
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
                <span>Showing 1 to 6 of 142 results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
}
