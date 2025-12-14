'use client';

export default function AdminDashboard() {
    const stats = [
        { name: 'Total Revenue', value: '£45,231.89', change: '+20.1%', trend: 'up' },
        { name: 'Active Orders', value: '142', change: '+3.2%', trend: 'up' },
        { name: 'Total Customers', value: '1,230', change: '+12.5%', trend: 'up' },
        { name: 'Products Stock', value: '450', change: '-2.4%', trend: 'down' },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
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
                        <button className="text-sm text-[#56cfe1] hover:text-[#1d2a48]">View All</button>
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
                                    {[101, 102, 103, 104, 105].map((id, index) => (
                                        <tr key={id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-[#1d2a48] font-medium">#{id}</td>
                                            <td className="py-4">John Doe</td>
                                            <td className="py-4 text-gray-500">Dec {12 - index}, 2025</td>
                                            <td className="py-4 font-medium">£{Math.floor(Math.random() * 100) + 20}.99</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                        index === 2 ? 'bg-red-100 text-red-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {index === 0 ? 'Pending' : index === 2 ? 'Cancelled' : 'Completed'}
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
