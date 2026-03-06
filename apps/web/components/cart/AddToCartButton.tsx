"use client"

import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"
import { useCart } from "@/components/cart/Context"

type AddToCartButtonProps = {
  product: {
    id: number
    title: string
    price: number
    thumbnail: string
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.title} added to cart`)
  }

  return (
    <Button type="button" className="w-full md:w-auto" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  )
}
