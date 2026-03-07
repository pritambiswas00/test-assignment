import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductList from "../ProductList.jsx"
import type { ProductList as ProductListType } from "../types.js"
import type { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react"

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    children?: ReactNode
}

type MockDivProps = HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode
}

type MockProductImageProps = ImgHTMLAttributes<HTMLImageElement>

type MockProductPriceProps = {
    amount: number
}

const createMockProduct = (
    overrides: Partial<ProductListType[number]> = {},
): ProductListType[number] => ({
    id: 1,
    title: "Product 1",
    description: "Test description",
    category: "beauty",
    price: 100,
    discountPercentage: 0,
    rating: 4.5,
    stock: 10,
    tags: ["tag1"],
    sku: "SKU-1",
    weight: 1,
    dimensions: {
        width: 1,
        height: 1,
        depth: 1,
    },
    warrantyInformation: "1 year",
    shippingInformation: "Ships in 3-5 days",
    availabilityStatus: "In Stock",
    reviews: [
        {
            rating: 5,
            comment: "Great",
            date: "2024-01-10",
            reviewerName: "John Doe",
            reviewerEmail: "john.doe@example.com",
        },
    ],
    returnPolicy: "30-day return policy",
    minimumOrderQuantity: 1,
    meta: {
        createdAt: "2024-01-01",
        updatedAt: "2024-01-15",
        barcode: "123456789",
        qrCode: "https://example.test/qr",
    },
    images: ["https://example.test/image-1.jpg"],
    thumbnail: "/img1.jpg",
    ...overrides,
})

vi.mock("next/link", () => ({
        default: ({ children, href, ...props }: MockLinkProps) => (
            <a href={href} {...props}>
                {children}
            </a>
        ),
}))

vi.mock("@workspace/ui/components/card", () => ({
        Card: ({ children, ...props }: MockDivProps) => <div data-testid="card" {...props}>{children}</div>,
        CardContent: ({ children, ...props }: MockDivProps) => <div data-testid="card-content" {...props}>{children}</div>,
        CardHeader: ({ children, ...props }: MockDivProps) => <div data-testid="card-header" {...props}>{children}</div>,
        CardTitle: ({ children, ...props }: MockDivProps) => <div data-testid="card-title" {...props}>{children}</div>,
}))

vi.mock("../common", () => ({
        ProductImage: ({ src, alt, ...props }: MockProductImageProps) => <img src={src} alt={alt} data-testid="product-image" {...props} />,
        ProductPrice: ({ amount }: MockProductPriceProps) => <span data-testid="product-price">{amount}</span>,
}))

describe("ProductList", () => {
    it("renders empty state when no products", () => {
        const products: ProductListType = []
        render(<ProductList products={products} />)

        expect(screen.getByText("No products found.")).toBeInTheDocument()
    })

    it("renders product list with correct number of items", () => {
        const products: ProductListType = [
            createMockProduct({ id: 1, title: "Product 1", price: 100, thumbnail: "/img1.jpg" }),
            createMockProduct({ id: 2, title: "Product 2", price: 200, thumbnail: "/img2.jpg" }),
        ]
        render(<ProductList products={products} />)

        expect(screen.getByText("Product 1")).toBeInTheDocument()
        expect(screen.getByText("Product 2")).toBeInTheDocument()
    })

    it("renders links with correct hrefs", () => {
        const products: ProductListType = [createMockProduct({ id: 1, title: "Product 1", price: 100, thumbnail: "/img1.jpg" })]
        render(<ProductList products={products} />)

        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("href", "/products/1")
    })

    it("renders product images with correct src and alt", () => {
        const products: ProductListType = [createMockProduct({ id: 1, title: "Product 1", price: 100, thumbnail: "/img1.jpg" })]
        render(<ProductList products={products} />)

        const image = screen.getByTestId("product-image")
        expect(image).toHaveAttribute("src", "/img1.jpg")
        expect(image).toHaveAttribute("alt", "Product 1")
    })

    it("renders product prices correctly", () => {
        const products: ProductListType = [createMockProduct({ id: 1, title: "Product 1", price: 150, thumbnail: "/img1.jpg" })]
        render(<ProductList products={products} />)
        expect(screen.getByTestId("product-price")).toHaveTextContent("150")
    })
})