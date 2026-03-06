"use client"

import Link from "next/link"
import { CartPopup } from "@/components/cart/CartPopup"

export function CartHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Product Catalog
        </Link>

        <CartPopup />
      </div>
    </header>
  )
}
