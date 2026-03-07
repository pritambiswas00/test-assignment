import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { AddToCartButton } from "../AddToCartButton"
import * as CartContext from "@/components/cart/Context"
import * as Sonner from "@workspace/ui/components/sonner"

vi.mock("@/components/cart/Context")
vi.mock("@workspace/ui/components/sonner")

describe("AddToCartButton", () => {
    const mockProduct = {
        id: 1,
        title: "Test Product",
        price: 99.99,
        thumbnail: "https://example.com/image.jpg",
    }

    const mockAddItem = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(CartContext.useCart).mockReturnValue({
            addItem: mockAddItem,
        } as any)
        vi.mocked(Sonner.toast).success = vi.fn()
    })

    it("renders button with correct text", () => {
        render(<AddToCartButton product={mockProduct} />)
        expect(screen.getByText("Add to Cart")).toBeInTheDocument()
    })

    it("calls addItem with product when clicked", () => {
        render(<AddToCartButton product={mockProduct} />)
        fireEvent.click(screen.getByText("Add to Cart"))
        expect(mockAddItem).toHaveBeenCalledWith(mockProduct)
    })

    it("shows success toast with product title", () => {
        render(<AddToCartButton product={mockProduct} />)
        fireEvent.click(screen.getByText("Add to Cart"))
        expect(Sonner.toast.success).toHaveBeenCalledWith("Test Product added to cart")
    })

    it("has correct button classes", () => {
        render(<AddToCartButton product={mockProduct} />)
        const button = screen.getByRole("button")
        expect(button).toHaveClass("w-full", "md:w-auto")
    })
})