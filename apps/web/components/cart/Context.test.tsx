import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CartProvider, useCart } from "./Context"
import * as React from "react"

vi.mock("@workspace/local-storage", () => ({
    createLocalStorageManager: () => ({
        getItem: vi.fn(() => ({ tag: "ok", value: { some: null } })),
        setItem: vi.fn(() => ({ tag: "ok" })),
    }),
}))

vi.mock("@workspace/ui/components/sonner", () => ({
    toast: {
        error: vi.fn(),
    },
}))

const TestComponent = () => {
    const { items, itemCount, addItem, removeItem, clearCart } = useCart()

    return (
        <div>
            <div data-testid="item-count">{itemCount}</div>
            <div data-testid="items-list">{JSON.stringify(items)}</div>
            <button onClick={() => addItem({ id: 1,  price: 10, thumbnail: "test.jpg", title: "Test Item" })}>
                Add Item
            </button>
            <button onClick={() => removeItem(1)}>Remove Item</button>
            <button onClick={() => clearCart()}>Clear Cart</button>
        </div>
    )
}

describe("CartProvider and useCart", () => {
    it("should throw error when useCart is used outside CartProvider", () => {
        expect(() => {
            render(<TestComponent />)
        }).toThrow("useCart must be used within CartProvider")
    })

    it("should initialize with empty cart", () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>,
        )

        expect(screen.getByTestId("item-count")).toHaveTextContent("0")
    })

    it("should add item to cart", async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>,
        )

        await user.click(screen.getByText("Add Item"))

        await waitFor(() => {
            expect(screen.getByTestId("item-count")).toHaveTextContent("1")
        })
    })

    it("should remove item from cart", async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>,
        )

        await user.click(screen.getByText("Add Item"))
        await user.click(screen.getByText("Remove Item"))

        await waitFor(() => {
            expect(screen.getByTestId("item-count")).toHaveTextContent("0")
        })
    })

    it("should clear cart", async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>,
        )

        await user.click(screen.getByText("Add Item"))
        await user.click(screen.getByText("Clear Cart"))

        await waitFor(() => {
            expect(screen.getByTestId("item-count")).toHaveTextContent("0")
        })
    })
})