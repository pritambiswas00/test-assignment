import { z } from 'zod';
import { DimensionsSchema, MetaSchema, ProductListSchema, ProductSchema, ReviewSchema } from './validation';

export type Dimensions = z.infer<typeof DimensionsSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;