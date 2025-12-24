import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    userId: string;
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        zip: string;
        country: string;
        phone?: string;
    };
    transactionId?: string;
}

const OrderSchema: Schema = new Schema({
    userId: { type: String, required: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    shippingAddress: {
        name: String,
        street: String,
        city: String,
        zip: String,
        country: String,
        phone: String
    },
    transactionId: String,
}, {
    timestamps: true
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
