import { describe, it, expect } from 'vitest';
import { CartItemSchema, CartStateSchema } from '../index';

describe('CartItemSchema', () => {
    it('should validate a correct cart item', () => {
        const validItem = {
            id: 1,
            title: 'Product Name',
            price: 29.99,
            thumbnail: 'https://example.com/image.jpg',
            quantity: 5,
        };
        expect(CartItemSchema.parse(validItem)).toEqual(validItem);
    });

    it('should fail when id is not a number', () => {
        expect(() =>
            CartItemSchema.parse({
                id: 'not-a-number',
                title: 'Product',
                price: 29.99,
                thumbnail: 'https://example.com/image.jpg',
                quantity: 1,
            })
        ).toThrow();
    });

    it('should fail when price is not a number', () => {
        expect(() =>
            CartItemSchema.parse({
                id: 1,
                title: 'Product',
                price: 'free',
                thumbnail: 'https://example.com/image.jpg',
                quantity: 1,
            })
        ).toThrow();
    });

    it('should fail when thumbnail is not a valid URL', () => {
        expect(() =>
            CartItemSchema.parse({
                id: 1,
                title: 'Product',
                price: 29.99,
                thumbnail: 'not-a-url',
                quantity: 1,
            })
        ).toThrow();
    });

    it('should fail when quantity is not a positive integer', () => {
        expect(() =>
            CartItemSchema.parse({
                id: 1,
                title: 'Product',
                price: 29.99,
                thumbnail: 'https://example.com/image.jpg',
                quantity: -1,
            })
        ).toThrow();
    });

    it('should fail when quantity is not an integer', () => {
        expect(() =>
            CartItemSchema.parse({
                id: 1,
                title: 'Product',
                price: 29.99,
                thumbnail: 'https://example.com/image.jpg',
                quantity: 1.5,
            })
        ).toThrow();
    });
});

describe('CartStateSchema', () => {
    it('should validate correct cart state with items', () => {
        const validState = {
            items: [
                {
                    id: 1,
                    title: 'Product 1',
                    price: 29.99,
                    thumbnail: 'https://example.com/image1.jpg',
                    quantity: 2,
                },
            ],
        };
        expect(CartStateSchema.parse(validState)).toEqual(validState);
    });

    it('should validate cart state with empty items array', () => {
        const emptyState = { items: [] };
        expect(CartStateSchema.parse(emptyState)).toEqual(emptyState);
    });

    it('should fail when items is not an array', () => {
        expect(() =>
            CartStateSchema.parse({
                items: 'not-an-array',
            })
        ).toThrow();
    });

    it('should fail when items array contains invalid item', () => {
        expect(() =>
            CartStateSchema.parse({
                items: [
                    {
                        id: 1,
                        title: 'Product',
                        price: 29.99,
                        thumbnail: 'https://example.com/image.jpg',
                        quantity: -1,
                    },
                ],
            })
        ).toThrow();
    });
});