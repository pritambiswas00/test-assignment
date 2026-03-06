import type { AxiosRequestConfig, AxiosResponse } from "axios"
import type { Option, Result } from "@workspace/utils"

export type RequestConfig = AxiosRequestConfig

export type HttpHeaders = AxiosResponse<unknown>["headers"]

export type HttpSuccess<T> = {
  readonly data: T
  readonly status: number
  readonly headers: HttpHeaders
}

export type HttpError = {
  readonly message: string
  readonly status: Option.Option<number>
  readonly code: Option.Option<string>
  readonly details: Option.Option<unknown>
}

export type HttpResult<T> = Result.Result<HttpSuccess<T>, HttpError>
