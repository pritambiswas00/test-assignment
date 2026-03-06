import { z } from 'zod';

export const CartItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  thumbnail: z.string().url(),
  quantity: z.number().int().positive(),
})

export const CartStateSchema = z.object({
  items: z.array(CartItemSchema),
})