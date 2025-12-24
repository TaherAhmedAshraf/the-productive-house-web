'use client';

import { useEffect, useState } from 'react';
import { getAdminCustomers } from '../../lib/api';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminCustomers().then((res) => {
            setCustomers(res.data || []);
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
                <h2 className="text-xl font-bold text-[#1d2a48]">Customers</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#56cfe1]"
                    />
                    <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Export List
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Customer</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Contact</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Orders</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Total Spent</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.map((customer) => (
                            <tr key={customer.uid} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#1d2a48] text-white flex items-center justify-center text-xs font-bold">
                                            {customer.displayName?.charAt(0) || 'U'}
                                        </div>
                                        <span className="font-medium text-[#1d2a48]">{customer.displayName || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                                <td className="px-6 py-4">{customer.totalOrders || 0}</td>
                                <td className="px-6 py-4 font-medium">£{(customer.totalSpent || 0).toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <button className="text-[#56cfe1] hover:text-[#1d2a48] font-medium text-sm">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {customers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No customers found</p>
                </div>
            )}

            <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Showing {customers.length} results</span>
            </div>
        </div>
    );
}
