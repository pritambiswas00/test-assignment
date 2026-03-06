"use client"

import { MinusIcon, PlusIcon, ShoppingCart, Trash2Icon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"

import { useCart } from "@/components/cart/Context"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

export function CartPopup() {
  const { items, itemCount, addItem, removeItem, clearCart } = useCart()

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="gap-2">
          <ShoppingCart className="size-4" />
          <span>Cart</span>
          <Badge variant="secondary">{itemCount}</Badge>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>Manage quantities or remove products.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {currencyFormatter.format(item.price)} each
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {currencyFormatter.format(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Decrease quantity for ${item.title}`}
                      >
                        <MinusIcon className="size-4" />
                      </Button>

                      <Badge variant="secondary">{item.quantity}</Badge>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          addItem({
                            id: item.id,
                            title: item.title,
                            price: item.price,
                            thumbnail: item.thumbnail,
                          })
                        }
                        aria-label={`Increase quantity for ${item.title}`}
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        for (let index = 0; index < item.quantity; index += 1) {
                          removeItem(item.id)
                        }
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-base font-semibold">{currencyFormatter.format(totalAmount)}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={clearCart}
              disabled={items.length === 0}
            >
              Clear cart
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
