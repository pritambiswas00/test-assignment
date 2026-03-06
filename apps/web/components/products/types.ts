import { z } from 'zod';
import { DimensionsSchema, MetaSchema, ProductListSchema, ProductSchema, ProductsResponseSchema, ReviewSchema } from './validation';
import { Result } from '@workspace/utils';

export type Dimensions = z.infer<typeof DimensionsSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
export type ProductsApiError = {
  endpoint: string
  message: string
}

export type ProductsApiResult<T> = Result.Result<T, ProductsApiError>