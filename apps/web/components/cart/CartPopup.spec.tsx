import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { CartPopup } from "./CartPopup"
import { useCart } from "@/components/cart/Context"

vi.mock("@/components/cart/Context")

describe("CartPopup", () => {
    const mockAddItem = vi.fn()
    const mockRemoveItem = vi.fn()
    const mockClearCart = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders cart button with item count", () => {
        vi.mocked(useCart).mockReturnValue({
            items: [],
            itemCount: 0,
            addItem: mockAddItem,
            removeItem: mockRemoveItem,
            clearCart: mockClearCart,
        })

        render(<CartPopup />)
        expect(screen.getByText("Cart")).toBeInTheDocument()
        expect(screen.getByText("0")).toBeInTheDocument()
    })

    it("displays empty cart message when no items", () => {
        vi.mocked(useCart).mockReturnValue({
            items: [],
            itemCount: 0,
            addItem: mockAddItem,
            removeItem: mockRemoveItem,
            clearCart: mockClearCart,
        })

        render(<CartPopup />)
        fireEvent.click(screen.getByRole("button", { name: /cart/i }))
        expect(screen.getByText("Your cart is empty.")).toBeInTheDocument()
    })

    it("formats currency with 2 decimal places", () => {
        const mockItems = [
            { id: 1, title: "Item", price: 19.99, quantity: 1, thumbnail: "" },
        ]

        vi.mocked(useCart).mockReturnValue({
            items: mockItems,
            itemCount: 1,
            addItem: mockAddItem,
            removeItem: mockRemoveItem,
            clearCart: mockClearCart,
        })

        render(<CartPopup />)
        fireEvent.click(screen.getByRole("button", { name: /cart/i }))
        expect(screen.getByText("$19.99 each")).toBeInTheDocument()
    })

    it("calls removeItem when minus button clicked", () => {
        const mockItems = [
            { id: 1, title: "Test Item", price: 10, quantity: 2, thumbnail: "" },
        ]

        vi.mocked(useCart).mockReturnValue({
            items: mockItems,
            itemCount: 2,
            addItem: mockAddItem,
            removeItem: mockRemoveItem,
            clearCart: mockClearCart,
        })

        render(<CartPopup />)
        fireEvent.click(screen.getByRole("button", { name: /cart/i }))
        fireEvent.click(screen.getByLabelText(/decrease quantity/i))
        expect(mockRemoveItem).toHaveBeenCalledWith(1)
    })

    it("calls clearCart when clear button clicked", () => {
        const mockItems = [
            { id: 1, title: "Item", price: 10, quantity: 1, thumbnail: "" },
        ]

        vi.mocked(useCart).mockReturnValue({
            items: mockItems,
            itemCount: 1,
            addItem: mockAddItem,
            removeItem: mockRemoveItem,
            clearCart: mockClearCart,
        })

        render(<CartPopup />)
        fireEvent.click(screen.getByRole("button", { name: /cart/i }))
        fireEvent.click(screen.getByRole("button", { name: /clear cart/i }))
        expect(mockClearCart).toHaveBeenCalled()
    })
})