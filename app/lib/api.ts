const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Helper to wait for auth to initialize
const waitForAuthInit = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

// Helper to get auth headers
const getAuthHeaders = async () => {
    await waitForAuthInit();
    const user = auth.currentUser;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// ============ PRODUCTS API ============

export async function getProducts(params?: URLSearchParams) {
    try {
        const queryString = params ? `?${params.toString()}` : '';
        const res = await fetch(`${API_URL}/products${queryString}`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        return { data: [] };
    }
}

export async function getProduct(id: string) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

export async function createProduct(productData: any) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(productData),
        });
        if (!res.ok) {
            throw new Error('Failed to create product');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function updateProduct(id: string, productData: any) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(productData),
        });
        if (!res.ok) {
            throw new Error('Failed to update product');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function deleteProduct(id: string) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers
        });
        if (!res.ok) {
            throw new Error('Failed to delete product');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============ ORDERS API ============

export async function createOrder(orderData: {
    userId: string;
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        zip: string;
        country: string;
    };
    total: number;
}) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to create order');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function getMyOrders(userId: string) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/orders/my-orders?userId=${userId}`, {
            cache: 'no-store',
            headers
        });
        if (!res.ok) {
            throw new Error('Failed to fetch orders');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

export async function getOrder(id: string) {
    try {
        // getOrder is technically public but could be protected. 
        // We'll pass auth headers if available, but not required yet by backend setup for single order GET.
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/orders/${id}`, {
            cache: 'no-store',
            headers
        });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

export async function updateOrderStatus(id: string, status: string, trackingNumber?: string) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/orders/${id}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status, trackingNumber }),
        });
        if (!res.ok) {
            throw new Error('Failed to update order status');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============ ADMIN API ============

export async function getAdminStats() {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/stats`, {
            cache: 'no-store',
            headers
        });
        if (!res.ok) {
            throw new Error('Failed to fetch admin stats');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function getAdminCustomers() {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/customers`, {
            cache: 'no-store',
            headers
        });
        if (!res.ok) {
            throw new Error('Failed to fetch customers');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function getAllOrders() {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/orders`, {
            cache: 'no-store',
            headers
        });
        if (!res.ok) {
            throw new Error('Failed to fetch all orders');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============ USERS API ============

export async function getMe() {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/me`, {
            cache: 'no-store',
            headers
        });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

export async function updateUserProfile(profileData: Partial<UserProfile>) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/me`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(profileData),
        });
        if (!res.ok) {
            throw new Error('Failed to update profile');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function getWishlist() {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/wishlist`, {
            cache: 'no-store',
            headers
        });
        if (!res.ok) {
            throw new Error('Failed to fetch wishlist');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        return { data: [] };
    }
}

export async function toggleWishlist(productId: string) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/users/wishlist/toggle`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ productId }),
        });
        if (!res.ok) {
            throw new Error('Failed to toggle wishlist');
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
