import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import User from './models/User';
import Order from './models/Order';
import connectDB from './lib/db';

dotenv.config();

const products = [
    {
        name: 'Daily Planner 2025',
        description: 'Premium daily planner with monthly and weekly spreads. Perfect for organizing your day.',
        price: 29.99,
        stock: 150,
        category: 'Planners',
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500',
        images: ['https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500'],
        specifications: { pages: 365, size: 'A5', binding: 'Hardcover' }
    },
    {
        name: 'Luxury Fountain Pen',
        description: 'Elegant fountain pen with smooth ink flow. Makes writing a pleasure.',
        price: 85.00,
        stock: 45,
        category: 'Stationery',
        image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=500',
        images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=500'],
        specifications: { material: 'Metal', color: 'Black', inkType: 'Refillable' }
    },
    {
        name: 'Weekly Desk Pad',
        description: 'Large desk pad with weekly layout. Stay organized throughout the week.',
        price: 24.99,
        stock: 200,
        category: 'Planners',
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=500',
        images: ['https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=500'],
        specifications: { sheets: 52, size: 'A3' }
    },
    {
        name: 'Productivity Journal',
        description: 'Guided journal for tracking goals and habits. Boost your productivity.',
        price: 34.99,
        stock: 120,
        category: 'Journals',
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=500',
        images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=500'],
        specifications: { pages: 200, guided: true }
    },
    {
        name: 'Premium Notebook Set',
        description: 'Set of 3 premium notebooks with different ruling styles.',
        price: 42.00,
        stock: 80,
        category: 'Notebooks',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500',
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500'],
        specifications: { count: 3, pages: 120, ruling: 'Mixed' }
    }
];

const users = [
    {
        uid: 'user_001',
        email: 'john.doe@example.com',
        displayName: 'John Doe',
        phone: '+44 7700 900001'
    },
    {
        uid: 'user_002',
        email: 'sarah.miller@example.com',
        displayName: 'Sarah Miller',
        phone: '+44 7700 900002'
    },
    {
        uid: 'user_003',
        email: 'james.thompson@example.com',
        displayName: 'James Thompson',
        phone: '+44 7700 900003'
    }
];

async function seed() {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});

        console.log('📦 Creating products...');
        const createdProducts = await Product.insertMany(products);
        console.log(`✅ Created ${createdProducts.length} products`);

        console.log('👥 Creating users...');
        const createdUsers = await User.insertMany(users);
        console.log(`✅ Created ${createdUsers.length} users`);

        console.log('🛒 Creating sample orders...');
        const orders = [
            {
                userId: createdUsers[0].uid,
                items: [
                    {
                        productId: createdProducts[0]._id,
                        name: createdProducts[0].name,
                        price: createdProducts[0].price,
                        quantity: 2,
                        image: createdProducts[0].image
                    },
                    {
                        productId: createdProducts[1]._id,
                        name: createdProducts[1].name,
                        price: createdProducts[1].price,
                        quantity: 1,
                        image: createdProducts[1].image
                    }
                ],
                total: 145.00,
                shippingAddress: {
                    name: 'John Doe',
                    street: '123 Baker Street',
                    city: 'London',
                    zip: 'NW1 6XE',
                    country: 'United Kingdom'
                },
                status: 'delivered'
            },
            {
                userId: createdUsers[1].uid,
                items: [
                    {
                        productId: createdProducts[2]._id,
                        name: createdProducts[2].name,
                        price: createdProducts[2].price,
                        quantity: 1,
                        image: createdProducts[2].image
                    }
                ],
                total: 32.50,
                shippingAddress: {
                    name: 'Sarah Miller',
                    street: '456 Oxford Road',
                    city: 'Manchester',
                    zip: 'M1 5GD',
                    country: 'United Kingdom'
                },
                status: 'pending'
            },
            {
                userId: createdUsers[2].uid,
                items: [
                    {
                        productId: createdProducts[3]._id,
                        name: createdProducts[3].name,
                        price: createdProducts[3].price,
                        quantity: 1,
                        image: createdProducts[3].image
                    },
                    {
                        productId: createdProducts[4]._id,
                        name: createdProducts[4].name,
                        price: createdProducts[4].price,
                        quantity: 1,
                        image: createdProducts[4].image
                    }
                ],
                total: 89.99,
                shippingAddress: {
                    name: 'James Thompson',
                    street: '789 High Street',
                    city: 'Birmingham',
                    zip: 'B1 1AA',
                    country: 'United Kingdom'
                },
                status: 'shipped'
            }
        ];

        const createdOrders = await Order.insertMany(orders);
        console.log(`✅ Created ${createdOrders.length} orders`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Products: ${createdProducts.length}`);
        console.log(`   Users: ${createdUsers.length}`);
        console.log(`   Orders: ${createdOrders.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed();
