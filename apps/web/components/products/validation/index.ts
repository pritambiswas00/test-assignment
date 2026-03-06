import { z } from 'zod';

export const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

export const ReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
  reviewerEmail: z.string().email(),
});

export const MetaSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  barcode: z.string(),
  qrCode: z.string().url(),
});

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  tags: z.array(z.string()),
  sku: z.string(),
  weight: z.number(),
  dimensions: DimensionsSchema,
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.enum(['In Stock', 'Out of Stock', 'Preorder', 'Low Stock']),
  reviews: z.array(ReviewSchema),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number(),
  meta: MetaSchema,
  images: z.array(z.string().url()),
  thumbnail: z.string().url(),
});

export const ProductListSchema = z.array(ProductSchema);

export const ProductsResponseSchema = z.object({
  products: ProductListSchema,
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})