import { getFromApi } from "@/lib/httpClient"
import { ProductSchema, ProductsResponseSchema } from "@/components/products/validation"
import type { Product, ProductsApiResult, ProductsResponse } from "@/components/products/types"
import { Option, Result } from "@workspace/utils"
import { formatEndpointError } from "./common";

const BASE_END_POINT = "/products" as const;

export const getProducts = async (): Promise<ProductsApiResult<ProductsResponse>> => {
  const response = await getFromApi<ProductsResponse>(BASE_END_POINT);
  return Result.match(response, {
    err: (error) => Result.err({
      reason: "request_failed",
      endpoint: BASE_END_POINT,
      message: formatEndpointError(BASE_END_POINT, error.message),
      status: Option.match(error.status, {
        some: (status) => status,
        none: () => null,
      })
    }),
    ok: (value) => {
      const parsed = ProductsResponseSchema.safeParse(value.data)
      if (!parsed.success) {
        return Result.err({
          reason: "invalid_payload",
          endpoint: BASE_END_POINT,
          message: formatEndpointError(BASE_END_POINT, parsed.error.errors
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ')),
          status: 400,
        })
      }
      return Result.ok(parsed.data)
    }
  })

}

export const getProductById = async (productId: number): Promise<ProductsApiResult<Product>> => {
  const END_POINT = `${BASE_END_POINT}/${productId}` as const;
  const response = await getFromApi<Product>(END_POINT)
  return Result.match(response, {
    err: (error) => Result.err({
      reason: "request_failed",
      endpoint: END_POINT,
      message: formatEndpointError(END_POINT, error.message),
      status: Option.match(error.status, {
        some: (value) => value,
        none: () => null
      })
    }),
    ok: (value) => {
      const parsed = ProductSchema.safeParse(value.data)
      if (!parsed.success) {
        return Result.err({
          reason: "invalid_payload",
          endpoint: END_POINT,
          message: formatEndpointError(END_POINT, parsed.error.errors
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ')),
          status: 400,
        })
      }
      return Result.ok(parsed.data)
    }
  })
}
