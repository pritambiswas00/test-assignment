import { createHttpClient, type HttpResult, type RequestConfig } from "@workspace/http-client"
import { env } from "@/env"

export const httpClient = createHttpClient({
  baseURL: env.EXTERNAL_SERVER_API,
  timeout: 10_000,
})

export const getFromApi = <T>(path: string, config?: RequestConfig): Promise<HttpResult<T>> =>
  httpClient.get<T>(path, config)

export const postToApi = <T, B = unknown>(
  path: string,
  body?: B,
  config?: RequestConfig,
): Promise<HttpResult<T>> => httpClient.post<T, B>(path, body, config)

export const putToApi = <T, B = unknown>(
  path: string,
  body?: B,
  config?: RequestConfig,
): Promise<HttpResult<T>> => httpClient.put<T, B>(path, body, config)

export const patchToApi = <T, B = unknown>(
  path: string,
  body?: B,
  config?: RequestConfig,
): Promise<HttpResult<T>> => httpClient.patch<T, B>(path, body, config)

export const deleteFromApi = <T>(path: string, config?: RequestConfig): Promise<HttpResult<T>> =>
  httpClient.delete<T>(path, config)
