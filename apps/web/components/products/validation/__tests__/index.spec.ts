import { describe, it, expect } from 'vitest';
import {

DimensionsSchema,
ReviewSchema,
MetaSchema,
ProductSchema,
ProductsResponseSchema,
} from '../index';

describe('Validation Schemas', () => {
describe('DimensionsSchema', () => {
    it('should validate valid dimensions', () => {
        const data = { width: 10, height: 20, depth: 15 };
        expect(DimensionsSchema.parse(data)).toEqual(data);
    });

    it('should reject missing fields', () => {
        expect(() => DimensionsSchema.parse({ width: 10 })).toThrow();
    });
});

describe('ReviewSchema', () => {
    it('should validate valid review with correct email', () => {
        const data = {
            rating: 5,
            comment: 'Great product',
            date: '2024-01-01',
            reviewerName: 'John',
            reviewerEmail: 'john@example.com',
        };
        expect(ReviewSchema.parse(data)).toEqual(data);
    });

    it('should reject invalid email format', () => {
        const data = {
            rating: 5,
            comment: 'Great product',
            date: '2024-01-01',
            reviewerName: 'John',
            reviewerEmail: 'invalid-email',
        };
        expect(() => ReviewSchema.parse(data)).toThrow();
    });

    it('should reject email without domain', () => {
        const data = {
            rating: 5,
            comment: 'Great product',
            date: '2024-01-01',
            reviewerName: 'John',
            reviewerEmail: 'john@',
        };
        expect(() => ReviewSchema.parse(data)).toThrow();
    });
});

describe('MetaSchema', () => {
    it('should validate valid meta with correct URL', () => {
        const data = {
            createdAt: '2024-01-01',
            updatedAt: '2024-01-02',
            barcode: '123456',
            qrCode: 'https://example.com/qr',
        };
        expect(MetaSchema.parse(data)).toEqual(data);
    });

    it('should reject invalid URL in qrCode', () => {
        const data = {
            createdAt: '2024-01-01',
            updatedAt: '2024-01-02',
            barcode: '123456',
            qrCode: 'not-a-url',
        };
        expect(() => MetaSchema.parse(data)).toThrow();
    });
});

describe('ProductSchema', () => {
    it('should validate valid product', () => {
        const data = {
            id: 1,
            title: 'Test Product',
            description: 'A test product',
            category: 'Electronics',
            price: 99.99,
            discountPercentage: 10,
            rating: 4.5,
            stock: 50,
            tags: ['new', 'popular'],
            sku: 'SKU123',
            weight: 2.5,
            dimensions: { width: 10, height: 20, depth: 15 },
            warrantyInformation: '1 year',
            shippingInformation: 'Free shipping',
            availabilityStatus: 'In Stock',
            reviews: [
                {
                    rating: 5,
                    comment: 'Great',
                    date: '2024-01-01',
                    reviewerName: 'Jane',
                    reviewerEmail: 'jane@example.com',
                },
            ],
            returnPolicy: '30 days',
            minimumOrderQuantity: 1,
            meta: {
                createdAt: '2024-01-01',
                updatedAt: '2024-01-02',
                barcode: '123456',
                qrCode: 'https://example.com/qr',
            },
            images: ['https://example.com/img1.jpg'],
            thumbnail: 'https://example.com/thumb.jpg',
        };
        expect(ProductSchema.parse(data)).toEqual(data);
    });

    it('should reject invalid availabilityStatus', () => {
        const data = {
            id: 1,
            title: 'Test',
            description: 'Test',
            category: 'Electronics',
            price: 99.99,
            discountPercentage: 10,
            rating: 4.5,
            stock: 50,
            tags: [],
            sku: 'SKU123',
            weight: 2.5,
            dimensions: { width: 10, height: 20, depth: 15 },
            warrantyInformation: '1 year',
            shippingInformation: 'Free',
            availabilityStatus: 'Unknown',
            reviews: [],
            returnPolicy: '30 days',
            minimumOrderQuantity: 1,
            meta: {
                createdAt: '2024-01-01',
                updatedAt: '2024-01-02',
                barcode: '123456',
                qrCode: 'https://example.com/qr',
            },
            images: [],
            thumbnail: 'https://example.com/thumb.jpg',
        };
        expect(() => ProductSchema.parse(data)).toThrow();
    });
});

describe('ProductsResponseSchema', () => {
    it('should validate valid products response', () => {
        const data = {
            products: [],
            total: 0,
            skip: 0,
            limit: 10,
        };
        expect(ProductsResponseSchema.parse(data)).toEqual(data);
    });
});
});