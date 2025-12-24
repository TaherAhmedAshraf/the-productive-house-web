import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('Already connected to MongoDB');
            return;
        }

        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }

        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB via Mongoose');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
