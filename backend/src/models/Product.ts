import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    images: string[];
    category: string;
    stock: number;
    specifications: Record<string, string>;
    rating: number;
    reviews: number;
    badge?: string;
    inStock: boolean;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' }, // Main image
    images: { type: [String], default: [] }, // Gallery
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    specifications: { type: Map, of: String, default: {} },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    badge: { type: String },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for inStock
ProductSchema.virtual('inStock').get(function (this: IProduct) {
    return this.stock > 0;
});

// Clean up specifications to be object not Map when converting to JSON
ProductSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: any, ret: any) => {
        ret.id = ret._id;
        if (ret.specifications instanceof Map) {
            const specs: any = {};
            ret.specifications.forEach((value: any, key: any) => {
                specs[key] = value;
            });
            ret.specifications = specs;
        }
    }
});

export default (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
