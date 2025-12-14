'use client';

import { useState } from 'react';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'payment', label: 'Payment' },
        { id: 'shipping', label: 'Shipping' },
        { id: 'notifications', label: 'Notifications' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-[#1d2a48] mb-6">Store Settings</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Tabs Header */}
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                        ? 'border-[#56cfe1] text-[#1d2a48]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-[#1d2a48] mb-4">Store Details</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                        <input type="text" defaultValue="The Productive House" className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                        <input type="email" defaultValue="support@productivehouse.com" className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                        <select className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg">
                                            <option>GBP (£)</option>
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-[#1d2a48] mb-4">Payment Methods</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                        <span className="font-medium">Stripe</span>
                                    </div>
                                    <button className="text-green-600 font-medium text-sm">Connected</button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                        <span className="font-medium">PayPal</span>
                                    </div>
                                    <button className="text-[#56cfe1] font-medium text-sm">Connect</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-[#1d2a48] mb-4">Shipping Zones</h3>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">United Kingdom</span>
                                    <span className="text-sm text-gray-500">Default</span>
                                </div>
                                <div className="text-sm text-gray-600">Standard: £4.99 (Free over £40)</div>
                            </div>
                            <button className="text-[#56cfe1] font-medium text-sm mt-2">+ Add Shipping Zone</button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-[#1d2a48] mb-4">Email Notifications</h3>
                            {['Order Confirmation', 'Shipping Update', 'Abandoned Cart Recovery'].map((item) => (
                                <div key={item} className="flex items-center justify-between py-2">
                                    <span className="text-gray-700">{item}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#56cfe1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#56cfe1]"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button className="px-6 py-2 bg-[#1d2a48] text-white rounded-lg hover:bg-[#56cfe1] transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
