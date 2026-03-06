import { getFromApi } from "@/lib/httpClient"
import { ProductSchema, ProductListSchema } from "@/components/products/validation"
import { z } from "zod"

const ProductsResponseSchema = z.object({
  products: ProductListSchema,
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export type Product = z.infer<typeof ProductSchema>
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>

const formatEndpointError = (endpoint: string, message: string) =>
  `Request failed for ${endpoint}: ${message}`

export const getProducts = async (): Promise<ProductsResponse> => {
  const endpoint = "/products"
  const response = await getFromApi<unknown>(endpoint)

  if (response.tag === "err") {
    throw new Error(formatEndpointError(endpoint, response.error.message))
  }

  const parsed = ProductsResponseSchema.safeParse(response.value.data)

  if (!parsed.success) {
    throw new Error(formatEndpointError(endpoint, "Invalid products payload from API"))
  }

  return parsed.data
}

export const getProductById = async (productId: number): Promise<Product> => {
  const endpoint = `/products/${productId}`
  const response = await getFromApi<unknown>(endpoint)

  if (response.tag === "err") {
    throw new Error(formatEndpointError(endpoint, response.error.message))
  }

  const parsed = ProductSchema.safeParse(response.value.data)

  if (!parsed.success) {
    throw new Error(formatEndpointError(endpoint, "Invalid product payload from API"))
  }

  return parsed.data
}
