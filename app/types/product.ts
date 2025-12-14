export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    images?: string[]; // Multiple images for product details
    badge?: string;
    category: string;
    description: string;
    features?: string[];
    specifications?: {
        dimensions?: string;
        weight?: string;
        pages?: number;
        binding?: string;
        material?: string;
    };
    inStock: boolean;
    rating?: number;
    reviews?: number;
}

export const CATEGORIES = [
    'All Products',
    'Planners',
    'Journals',
    'Notebooks',
    'Accessories',
] as const;

export type Category = typeof CATEGORIES[number];
