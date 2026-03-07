import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CartHeader } from "./CartHeader"

vi.mock("@/components/cart/CartPopup", () => ({
    CartPopup: () => <div data-testid="cart-popup">CartPopup</div>,
}))

vi.mock("next/link", () => ({
    default: ({ href, children, className }: any) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
}))

describe("CartHeader", () => {
    it("should render header with border-b class", () => {
        const { container } = render(<CartHeader />)
        const header = container.querySelector("header")
        expect(header).toHaveClass("border-b")
    })

    it("should render Product Catalog link", () => {
        render(<CartHeader />)
        const link = screen.getByRole("link", { name: /product catalog/i })
        expect(link).toHaveAttribute("href", "/")
        expect(link).toHaveClass("text-sm", "font-semibold", "tracking-tight")
    })

    it("should render CartPopup component", () => {
        render(<CartHeader />)
        const cartPopup = screen.getByTestId("cart-popup")
        expect(cartPopup).toBeInTheDocument()
    })

    it("should render div with flex layout classes", () => {
        const { container } = render(<CartHeader />)
        const div = container.querySelector("div.flex")
        expect(div).toHaveClass("mx-auto", "flex", "h-14", "w-full", "max-w-6xl", "items-center", "justify-between", "px-4")
    })
})