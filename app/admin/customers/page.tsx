'use client';

export default function AdminCustomers() {
    const customers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, spent: 450.50, status: 'Active', joined: '2024-01-15' },
        { id: 2, name: 'Sarah Miller', email: 'sarah.m@example.com', orders: 5, spent: 145.00, status: 'Active', joined: '2024-03-22' },
        { id: 3, name: 'James Thompson', email: 'j.thompson@test.com', orders: 1, spent: 32.50, status: 'Inactive', joined: '2024-05-10' },
        { id: 4, name: 'Emily Wilson', email: 'emily.w@example.com', orders: 8, spent: 289.99, status: 'Active', joined: '2024-02-01' },
        { id: 5, name: 'Michael Chen', email: 'm.chen@example.com', orders: 3, spent: 210.00, status: 'Active', joined: '2024-06-15' },
        { id: 6, name: 'Jessica Brown', email: 'jess.brown@example.com', orders: 0, spent: 0.00, status: 'New', joined: '2025-12-08' },
    ];

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
                            <th className="px-6 py-4 font-medium text-gray-500">Joined</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Orders</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Total Spent</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#1d2a48] text-white flex items-center justify-center text-xs font-bold">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-[#1d2a48]">{customer.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                                <td className="px-6 py-4 text-gray-500">{customer.joined}</td>
                                <td className="px-6 py-4">{customer.orders}</td>
                                <td className="px-6 py-4 font-medium">£{customer.spent.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            customer.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-[#56cfe1] hover:text-[#1d2a48] font-medium text-sm">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Showing {customers.length} results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
