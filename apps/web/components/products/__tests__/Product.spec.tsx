import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import type { AddItemInput } from "@/components/cart/types"
import type { Product as ProductType } from "../types"
import Product from "../Product"

type MockDivProps = HTMLAttributes<HTMLDivElement> & { children?: ReactNode }
type MockAddToCartButtonProps = {
    product: AddItemInput
}
type MockProductPriceProps = HTMLAttributes<HTMLDivElement> & {
    amount: number
}
type MockProductDateProps = HTMLAttributes<HTMLSpanElement> & {
    value: string
}

vi.mock('@workspace/ui/components/card', () => ({
        Card: ({ children, ...props }: MockDivProps) => <div data-testid="card" {...props}>{children}</div>,
        CardContent: ({ children, ...props }: MockDivProps) => <div data-testid="card-content" {...props}>{children}</div>,
        CardDescription: ({ children, ...props }: MockDivProps) => <div data-testid="card-description" {...props}>{children}</div>,
        CardFooter: ({ children, ...props }: MockDivProps) => <div data-testid="card-footer" {...props}>{children}</div>,
        CardHeader: ({ children, ...props }: MockDivProps) => <div data-testid="card-header" {...props}>{children}</div>,
        CardTitle: ({ children, ...props }: MockDivProps) => <div data-testid="card-title" {...props}>{children}</div>,
}))

vi.mock('@/components/cart', () => ({
        AddToCartButton: ({ product }: MockAddToCartButtonProps) => (
            <button data-testid="add-to-cart" data-product-id={product.id}>
                Add to Cart
            </button>
        ),
}))

vi.mock('../common', () => ({
        ProductImage: ({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => <img alt={alt} data-testid="product-image" {...props} />,
        ProductPrice: ({ amount, ...props }: MockProductPriceProps) => <div data-testid="product-price" {...props}>${amount}</div>,
        ProductDate: ({ value, ...props }: MockProductDateProps) => <span data-testid="product-date" {...props}>{value}</span>,
}))

describe('Product Component', () => {
    const mockProduct: ProductType = {
        id: 1,
        title: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        thumbnail: '/test-image.jpg',
        category: 'Electronics',
        meta: {
            updatedAt: '2024-01-15',
            barcode: '123456789',
            qrCode: 'https://example.test/qr',
            createdAt: '2024-01-01',
        },
        availabilityStatus: 'In Stock',
        dimensions: {
            width: 10,
            height: 5,
            depth: 2,
        },
        weight: 1.5,
        discountPercentage: 10,
        rating: 4.5,
        stock: 50,
        tags: ['tag1', 'tag2'],
        sku: 'SKU-123',
        warrantyInformation: '1 year warranty',
        shippingInformation: 'Ships in 3-5 days',
        reviews: [
            {
                rating: 5,
                comment: 'Great product!',
                date: '2024-01-10',
                reviewerName: 'John Doe',
                reviewerEmail: 'john.doe@example.com',
            },
        ],
        returnPolicy: '30-day return policy',
        minimumOrderQuantity: 1,
        images: ['/test-image.jpg', '/test-image-2.jpg'],
        }

    it('renders product information correctly', () => {
        render(<Product product={mockProduct} />)
        expect(screen.getByText('Test Product')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
        expect(screen.getByText(/Category: Electronics/)).toBeInTheDocument()
    })

    it('renders product image with correct attributes', () => {
        render(<Product product={mockProduct} />)

        const image = screen.getByTestId('product-image')
        expect(image).toHaveAttribute('alt', 'Test Product')
    })

    it('renders product price', () => {
        render(<Product product={mockProduct} />)

        expect(screen.getByTestId('product-price')).toBeInTheDocument()
    })

    it('renders add to cart button with product data', () => {
        render(<Product product={mockProduct} />)

        expect(screen.getByTestId('add-to-cart')).toBeInTheDocument()
    })

    it('displays updated date', () => {
        render(<Product product={mockProduct} />)

        expect(screen.getByTestId('product-date')).toBeInTheDocument()
    })
})