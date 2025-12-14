export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
    items: OrderItem[];
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        postcode: string;
        country: string;
    };
    paymentMethod: string;
    trackingNumber?: string;
}

export const userOrders: Order[] = [
    {
        id: 'ORD-7821',
        date: 'Dec 10, 2025',
        total: 145.00,
        status: 'Delivered',
        items: [
            { name: 'Daily Planner 2025', quantity: 2, price: 29.99, image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500' },
            { name: 'Luxury Fountain Pen', quantity: 1, price: 85.00, image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=500' }
        ],
        shippingAddress: {
            name: 'John Doe',
            street: '123 Baker Street',
            city: 'London',
            postcode: 'NW1 6XE',
            country: 'United Kingdom'
        },
        paymentMethod: 'Visa ending in 4242',
        trackingNumber: 'TRK-99887766'
    },
    {
        id: 'ORD-7549',
        date: 'Nov 24, 2025',
        total: 32.50,
        status: 'Processing',
        items: [
            { name: 'Weekly Desk Pad', quantity: 1, price: 24.99, image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=500' }
        ],
        shippingAddress: {
            name: 'John Doe',
            street: '123 Baker Street',
            city: 'London',
            postcode: 'NW1 6XE',
            country: 'United Kingdom'
        },
        paymentMethod: 'PayPal'
    }
];
