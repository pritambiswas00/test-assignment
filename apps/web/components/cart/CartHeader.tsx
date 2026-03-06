"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { useCart } from "@/components/cart/Context"

export function CartHeader() {
  const { itemCount } = useCart()

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Product Catalog
        </Link>

        <div className="flex items-center gap-2">
          <ShoppingCart className="size-4 text-muted-foreground" />
          <Badge variant="secondary">{itemCount}</Badge>
        </div>
      </div>
    </header>
  )
}
