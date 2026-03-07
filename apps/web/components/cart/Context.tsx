"use client"

import * as React from "react"
import { createLocalStorageManager, type ValueParser } from "@workspace/local-storage"
import { Option, Result } from "@workspace/utils"
import { toast } from "@workspace/ui/components/sonner"
import { CartState, CartAction, CartContextValue } from "./types"
import { CartStateSchema } from "./validation"

const CART_STORAGE_NAMESPACE = "web" as const;
const CART_STORAGE_KEY = "cart" as const;
const INITIAL_STATE: CartState = {
  items: [],
}

const cartStorage = createLocalStorageManager(CART_STORAGE_NAMESPACE)

const cartStateParser: ValueParser<CartState> = (value: unknown) => {
  const parsed = CartStateSchema.safeParse(value)

  if (!parsed.success) {
    return Result.err({
      reason: "deserialization_failed",
      key: CART_STORAGE_KEY,
      message: "Invalid cart payload in localStorage",
    })
  }

  return Result.ok(parsed.data)
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "hydrate":
      return action.payload

    case "add": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (!existingItem) {
        return {
          items: [...state.items, { ...action.payload, quantity: 1 }],
        }
      }

      return {
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      }
    }

    case "remove": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (!existingItem) {
        return state
      }

      if (existingItem.quantity === 1) {
        return {
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }

      return {
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item,
        ),
      }
    }

    case "clear":
      return INITIAL_STATE

    default:
      return state
  }
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(cartReducer, INITIAL_STATE)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    const storedCartResult = cartStorage.getItem<CartState>(CART_STORAGE_KEY, cartStateParser)

    if (storedCartResult.tag === "err") {
      toast.error(storedCartResult.error.message)
      setIsHydrated(true)
      return
    }

    Option.match(storedCartResult.value, {
      some: (storedState) => {
        dispatch({ type: "hydrate", payload: storedState })
      },
      none: () => undefined,
    })

    setIsHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!isHydrated) {
      return
    }

    const saveResult = cartStorage.setItem(CART_STORAGE_KEY, state)
    if (saveResult.tag === "err") {
      toast.error(saveResult.error.message)
    }
  }, [isHydrated, state])

  const value = React.useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount: state.items.reduce((count, item) => count + item.quantity, 0),
      addItem: (item) => dispatch({ type: "add", payload: item }),
      removeItem: (id) => dispatch({ type: "remove", payload: { id } }),
      clearCart: () => dispatch({ type: "clear" }),
    } as const),
    [state.items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = React.useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }

  return context
}
