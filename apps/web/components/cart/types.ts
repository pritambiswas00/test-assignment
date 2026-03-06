import { z } from 'zod';
import { CartItemSchema, CartStateSchema } from './validation';

export type CartItem = z.infer<typeof CartItemSchema>

export type CartState = z.infer<typeof CartStateSchema>

export type AddItemInput = Omit<CartItem, "quantity">

export type CartAction =
  | { type: "hydrate"; payload: CartState }
  | { type: "add"; payload: AddItemInput }
  | { type: "remove"; payload: { id: number } }
  | { type: "clear" }

export type CartContextValue = {
  items: CartItem[]
  itemCount: number
  addItem: (item: AddItemInput) => void
  removeItem: (id: number) => void
  clearCart: () => void
}