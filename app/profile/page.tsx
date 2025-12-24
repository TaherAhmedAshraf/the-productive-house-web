'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { getMyOrders, getWishlist, toggleWishlist } from '../lib/api';
import { useCart } from '../context/CartContext';

export default function ProfilePage() {
    const { user, userProfile, loading, logout, updateUserProfile, refreshProfile } = useAuth();
    const { addToCart } = useCart();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState<any[]>([]);
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const [displayName, setDisplayName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else {
                if (userProfile) {
                    setDisplayName(userProfile.displayName || '');
                }
                // Fetch orders using the real API
                getMyOrders(user.uid).then(data => {
                    setOrders(data);
                });

                // Fetch wishlist
                if (activeTab === 'wishlist') {
                    fetchWishlist();
                }
            }
        }
    }, [user, loading, router, userProfile, activeTab]);

    const fetchWishlist = async () => {
        setWishlistLoading(true);
        try {
            const data = await getWishlist();
            setWishlistItems(data.data || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId: string) => {
        try {
            await toggleWishlist(productId);
            setWishlistItems(prev => prev.filter(item => item._id !== productId));
            if (refreshProfile) refreshProfile();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            await updateUserProfile({ displayName });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1d2a48]"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#1d2a48] mb-8">My Account</h1>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                                <div className="p-6 bg-gradient-to-r from-[#1d2a48] to-[#2a3f5f] text-white text-center">
                                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                                        {userProfile?.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                    </div>
                                    <h2 className="font-bold text-lg truncate px-2">{userProfile?.displayName || 'User'}</h2>
                                    <p className="text-sm opacity-80 truncate px-2">{user.email}</p>
                                </div>

                                <nav className="p-4">
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => setActiveTab('profile')}
                                                className={`w-full text-left px-4 py-2 rounded font-medium transition-all ${activeTab === 'profile'
                                                    ? 'bg-gray-50 text-[#1d2a48] border-l-4 border-[#56cfe1]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                Profile Information
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => setActiveTab('orders')}
                                                className={`w-full text-left px-4 py-2 rounded font-medium transition-all ${activeTab === 'orders'
                                                    ? 'bg-gray-50 text-[#1d2a48] border-l-4 border-[#56cfe1]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                Order History
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => setActiveTab('wishlist')}
                                                className={`w-full text-left px-4 py-2 rounded font-medium transition-all ${activeTab === 'wishlist'
                                                    ? 'bg-gray-50 text-[#1d2a48] border-l-4 border-[#56cfe1]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                Wishlist
                                                {(userProfile?.wishlist?.length ?? 0) > 0 && (
                                                    <span className="ml-2 px-2 py-0.5 bg-[#56cfe1] text-white text-xs rounded-full">
                                                        {userProfile?.wishlist?.length}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                        <li className="pt-4 mt-4 border-t border-gray-100">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-lg shadow-sm p-8 animate-fade-in">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-[#1d2a48]">Profile Details</h2>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-[#56cfe1] hover:text-[#1d2a48] text-sm font-medium"
                                            >
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={user.email || ''}
                                                    disabled
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Display Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={`w-full px-4 py-2 border rounded-lg transition-colors ${isEditing
                                                        ? 'border-gray-300 focus:ring-2 focus:ring-[#56cfe1] focus:border-transparent'
                                                        : 'border-gray-200 bg-gray-50 text-gray-700'
                                                        }`}
                                                />
                                            </div>

                                            {isEditing && (
                                                <div className="flex justify-end gap-3 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDisplayName(userProfile?.displayName || '');
                                                            setIsEditing(false);
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={saveLoading}
                                                        className="px-4 py-2 bg-[#1d2a48] text-white rounded-lg hover:bg-[#56cfe1] transition-colors disabled:opacity-70"
                                                    >
                                                        {saveLoading ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </form>

                                    <div className="mt-10 pt-8 border-t border-gray-100">
                                        <h3 className="font-bold text-[#1d2a48] mb-4">Account Stats</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setActiveTab('orders')}>
                                                <span className="block text-3xl font-bold text-[#56cfe1] mb-1">
                                                    {orders.length}
                                                </span>
                                                <span className="text-sm text-gray-600">Total Orders</span>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setActiveTab('wishlist')}>
                                                <span className="block text-3xl font-bold text-[#56cfe1] mb-1">
                                                    {userProfile?.wishlist?.length || 0}
                                                </span>
                                                <span className="text-sm text-gray-600">Wishlist Items</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h2 className="text-xl font-bold text-[#1d2a48]">Order History</h2>

                                    {orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                                        <div className="flex gap-6 text-sm">
                                                            <div>
                                                                <span className="block text-gray-500">Order Placed</span>
                                                                <span className="font-medium text-[#1d2a48]">
                                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="block text-gray-500">Total</span>
                                                                <span className="font-medium text-[#1d2a48]">£{order.total.toFixed(2)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="block text-gray-500">Order #</span>
                                                                <span className="font-medium text-[#1d2a48]">{order._id.slice(-6).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                            <Link
                                                                href={`/profile/orders/${order._id}`}
                                                                className="text-sm font-medium text-[#1d2a48] hover:text-[#56cfe1] border border-gray-300 hover:border-[#56cfe1] px-4 py-1.5 rounded-full bg-white transition-colors"
                                                            >
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="p-4">
                                                        {order.items.map((item: any, idx: number) => (
                                                            <div key={idx} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-0 border-gray-100">
                                                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-medium text-[#1d2a48]">{item.name}</h4>
                                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-medium text-[#1d2a48]">£{item.price.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                                            <p className="text-gray-500 mt-1 mb-6">Start shopping to fill this space!</p>
                                            <Link href="/shop" className="px-6 py-2 bg-[#1d2a48] text-white rounded-lg hover:bg-[#56cfe1] transition-colors">
                                                Browse Shop
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Wishlist Tab */}
                            {activeTab === 'wishlist' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h2 className="text-xl font-bold text-[#1d2a48]">My Wishlist</h2>
                                    {wishlistLoading ? (
                                        <div className="flex justify-center py-12">
                                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1d2a48]"></div>
                                        </div>
                                    ) : wishlistItems.length > 0 ? (
                                        <div className="grid gap-4">
                                            {wishlistItems.map((item) => (
                                                <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex transform transition-all hover:shadow-md">
                                                    <Link href={`/product/${item._id}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </Link>
                                                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="min-w-0">
                                                                <Link href={`/product/${item._id}`}>
                                                                    <h3 className="font-bold text-[#1d2a48] hover:text-[#56cfe1] transition-colors truncate">{item.name}</h3>
                                                                </Link>
                                                                <p className="text-sm text-gray-500">{item.category}</p>
                                                            </div>
                                                            <p className="font-bold text-[#1d2a48] whitespace-nowrap">£{item.price.toFixed(2)}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-4">
                                                            <div className="flex gap-4">
                                                                <Link
                                                                    href={`/product/${item._id}`}
                                                                    className="text-xs font-medium uppercase tracking-wider text-[#56cfe1] hover:text-[#1d2a48] transition-colors"
                                                                >
                                                                    View Product
                                                                </Link>
                                                                <button
                                                                    onClick={() => {
                                                                        addToCart({
                                                                            id: item._id,
                                                                            name: item.name,
                                                                            price: item.price,
                                                                            image: item.image,
                                                                        });
                                                                    }}
                                                                    className="text-xs font-medium uppercase tracking-wider text-[#1d2a48] hover:text-[#56cfe1] transition-colors"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveFromWishlist(item._id)}
                                                                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                                            <p className="text-gray-500 mt-1 mb-6">Save items you love for later.</p>
                                            <Link href="/shop" className="px-6 py-2 bg-[#1d2a48] text-white rounded-lg hover:bg-[#56cfe1] transition-colors">
                                                Browse Shop
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
