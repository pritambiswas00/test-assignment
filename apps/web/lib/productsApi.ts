import { getFromApi } from "@/lib/httpClient"
import { ProductSchema, ProductsResponseSchema } from "@/components/products/validation"
import { Product, ProductsApiResult, ProductsResponse } from "@/components/products/types"
import { Option, Result } from "@workspace/utils"

const BASE_END_POINT = "/products" as const;
const formatEndpointError = (endpoint: string, message: string) =>
  `Request failed for ${endpoint}: ${message}`

export const getProducts = async (): Promise<ProductsApiResult<ProductsResponse>> => {
  const response = await getFromApi<unknown>(BASE_END_POINT)

  if (response.tag === "err") {
    return Result.err({
      reason: "request_failed",
      endpoint: BASE_END_POINT,
      message: formatEndpointError(BASE_END_POINT, response.error.message),
      status: Option.match(response.error.status, {
        some: (status) => status,
        none: () => null,
      }),
    })
  }

  const parsed = ProductsResponseSchema.safeParse(response.value.data)

  if (!parsed.success) {
    return Result.err({
      reason: "invalid_payload",
      endpoint: BASE_END_POINT,
      message: formatEndpointError(BASE_END_POINT, "Invalid products payload from API"),
      status: response.value.status,
    })
  }

  return Result.ok(parsed.data)
}

export const getProductById = async (productId: number): Promise<ProductsApiResult<Product>> => {
  const END_POINT = `${BASE_END_POINT}/${productId}` as const;
  const response = await getFromApi<unknown>(END_POINT)
  if (response.tag === "err") {
    return Result.err({
      reason: "request_failed",
      endpoint: END_POINT,
      message: formatEndpointError(END_POINT, response.error.message),
      status: Option.match(response.error.status, {
        some: (status) => status,
        none: () => null,
      }),
    })
  }
  const parsed = ProductSchema.safeParse(response.value.data)
  if (!parsed.success) {
    return Result.err({
      reason: "invalid_payload",
      endpoint: END_POINT,
      message: formatEndpointError(END_POINT, "Invalid product payload from API"),
      status: response.value.status,
    })
  }

  return Result.ok(parsed.data)
}
