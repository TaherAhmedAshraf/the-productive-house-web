'use client';

import { useEffect, useState } from 'react';
import { getAdminStats, getAllOrders } from '../lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        revenue: { total: 0, growth: 0 },
        activeOrders: 0,
        customers: { total: 0, newThisMonth: 0 },
        lowStockProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getAdminStats(),
            getAllOrders()
        ]).then(([statsData, ordersData]) => {
            setStats(statsData);
            setRecentOrders((ordersData.data || []).slice(0, 5));
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const statsCards = [
        { name: 'Total Revenue', value: `£${stats.revenue.total.toFixed(2)}`, change: `+${stats.revenue.growth}%`, trend: 'up' },
        { name: 'Active Orders', value: stats.activeOrders.toString(), change: '+3.2%', trend: 'up' },
        { name: 'Total Customers', value: stats.customers.total.toString(), change: `+${stats.customers.newThisMonth}`, trend: 'up' },
        { name: 'Low Stock Products', value: stats.lowStockProducts.toString(), change: '-2.4%', trend: 'down' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1d2a48]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                        <div className="mt-2 flex items-baseline justify-between">
                            <p className="text-3xl font-bold text-[#1d2a48]">{stat.value}</p>
                            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-[#1d2a48]">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-sm text-[#56cfe1] hover:text-[#1d2a48]">View All</Link>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium">Order ID</th>
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-[#1d2a48] font-medium">
                                                <Link href={`/admin/orders/${order._id}`} className="hover:text-[#56cfe1]">
                                                    #{order._id.slice(-6)}
                                                </Link>
                                            </td>
                                            <td className="py-4">{order.shippingAddress?.name || 'N/A'}</td>
                                            <td className="py-4 text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 font-medium">£{order.total.toFixed(2)}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-[#1d2a48]">Top Selling Products</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-[#1d2a48] truncate">Daily Planner 2025</h4>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                        <div className="bg-[#56cfe1] h-1.5 rounded-full" style={{ width: `${80 - i * 10}%` }}></div>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-600">{85 - i * 5}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
