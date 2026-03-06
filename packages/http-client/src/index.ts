import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type CreateAxiosDefaults,
} from "axios"
import { Option, Result } from "@workspace/utils"

import type { HttpError, HttpResult, HttpSuccess, RequestConfig } from "./types.js"

const toOption = <T>(value: T | null | undefined): Option.Option<T> =>
  value === null || value === undefined ? Option.none<T>() : Option.some(value)

const createHttpError = (error: AxiosError): HttpError => ({
  message: error.message,
  status: toOption(error.response?.status),
  code: toOption(error.code),
  details: toOption(error.response?.data),
})

const toHttpSuccess = <T>(response: AxiosResponse<T>): HttpSuccess<T> => ({
  data: response.data,
  status: response.status,
  headers: response.headers,
})

const handleAxiosCall = async <T>(request: () => Promise<HttpSuccess<T>>): Promise<HttpResult<T>> => {
  try {
    const response = await request()
    return Result.ok(response)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Result.err(createHttpError(error))
    }

    return Result.err({
      message: error instanceof Error ? error.message : "Unknown request error",
      status: Option.none<number>(),
      code: Option.none<string>(),
      details: toOption(error),
    })
  }
}

export type HttpClient = {
  get: <T>(url: string, config?: RequestConfig) => Promise<HttpResult<T>>
  delete: <T>(url: string, config?: RequestConfig) => Promise<HttpResult<T>>
  post: <T, B = unknown>(url: string, body?: B, config?: RequestConfig) => Promise<HttpResult<T>>
  put: <T, B = unknown>(url: string, body?: B, config?: RequestConfig) => Promise<HttpResult<T>>
  patch: <T, B = unknown>(url: string, body?: B, config?: RequestConfig) => Promise<HttpResult<T>>
}

export const createHttpClient = (defaults?: CreateAxiosDefaults): HttpClient => {
  const instance: AxiosInstance = axios.create(defaults)

  const get = async <T>(url: string, config?: RequestConfig): Promise<HttpResult<T>> =>
    handleAxiosCall(async () => {
      const response = await instance.get<T>(url, config)
      return toHttpSuccess(response)
    })

  const remove = async <T>(url: string, config?: RequestConfig): Promise<HttpResult<T>> =>
    handleAxiosCall(async () => {
      const response = await instance.delete<T>(url, config)
      return toHttpSuccess(response)
    })

  const post = async <T, B = unknown>(
    url: string,
    body?: B,
    config?: RequestConfig,
  ): Promise<HttpResult<T>> =>
    handleAxiosCall(async () => {
      const response = await instance.post<T>(url, body, config)
      return toHttpSuccess(response)
    })

  const put = async <T, B = unknown>(
    url: string,
    body?: B,
    config?: RequestConfig,
  ): Promise<HttpResult<T>> =>
    handleAxiosCall(async () => {
      const response = await instance.put<T>(url, body, config)
      return toHttpSuccess(response)
    })

  const patch = async <T, B = unknown>(
    url: string,
    body?: B,
    config?: RequestConfig,
  ): Promise<HttpResult<T>> =>
    handleAxiosCall(async () => {
      const response = await instance.patch<T>(url, body, config)
      return toHttpSuccess(response)
    })

  return {
    get,
    delete: remove,
    post,
    put,
    patch,
  } as const
}

export type { HttpError, HttpResult, HttpSuccess, RequestConfig } from "./types.js"
