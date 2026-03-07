import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import axios from "axios"
import type { AxiosInstance } from "axios"
import { Result, Option } from "@workspace/utils"
import { createHttpClient } from "../index.js"

vi.mock("axios")

describe("createHttpClient", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    describe("get", () => {
        it("should return successful response", async () => {
            const mockResponse = { data: { id: 1 }, status: 200, headers: {} }
            vi.mocked(axios.create).mockReturnValue({
                get: vi.fn().mockResolvedValue(mockResponse),
            } as unknown as AxiosInstance)

            const client = createHttpClient()
            const result = await client.get("/test")

            expect(Result.isOk(result)).toBe(true)
            if (Result.isOk(result)) {
                expect(result.value.data).toEqual({ id: 1 })
            }
        })

        it("should handle axios error", async () => {
            const error = Object.assign(new Error("Network error"), {
                response: { status: 404, data: { error: "Not found" } },
                code: "ERR_NOT_FOUND",
            })
            vi.mocked(axios.isAxiosError).mockReturnValue(true)
            vi.mocked(axios.create).mockReturnValue({
                get: vi.fn().mockRejectedValue(error),
            } as unknown as AxiosInstance)

            const client = createHttpClient()
            const result = await client.get("/test")

            expect(Result.isErr(result)).toBe(true)
            if (Result.isErr(result)) {
                expect(Option.isSome(result.error.status)).toBe(true)
            }
        })
    })

    describe("post", () => {
        it("should send body and return response", async () => {
            const mockResponse = { data: { id: 1 }, status: 201, headers: {} }
            vi.mocked(axios.create).mockReturnValue({
                post: vi.fn().mockResolvedValue(mockResponse),
            } as unknown as AxiosInstance)

            const client = createHttpClient()
            const result = await client.post("/test", { name: "test" })

            expect(Result.isOk(result)).toBe(true)
            if (Result.isOk(result)) {
                expect(result.value.status).toBe(201)
            }
        })
    })

    describe("delete", () => {
        it("should delete resource", async () => {
            const mockResponse = { data: null, status: 204, headers: {} }
            vi.mocked(axios.create).mockReturnValue({
                delete: vi.fn().mockResolvedValue(mockResponse),
            } as unknown as AxiosInstance)

            const client = createHttpClient()
            const result = await client.delete("/test")

            expect(Result.isOk(result)).toBe(true)
        })
    })

    describe("put", () => {
        it("should update resource", async () => {
            const mockResponse = { data: { id: 1, name: "updated" }, status: 200, headers: {} }
            vi.mocked(axios.create).mockReturnValue({
                put: vi.fn().mockResolvedValue(mockResponse),
            } as unknown as AxiosInstance)

            const client = createHttpClient()
            const result = await client.put("/test/1", { name: "updated" })

            expect(Result.isOk(result)).toBe(true)
        })
    })

    describe("patch", () => {
        it("should patch resource", async () => {
            const mockResponse = { data: { id: 1, name: "patched" }, status: 200, headers: {} }
            vi.mocked(axios.create).mockReturnValue({
                patch: vi.fn().mockResolvedValue(mockResponse),
            } as unknown as AxiosInstance)

            const client = createHttpClient()
            const result = await client.patch("/test/1", { name: "patched" })

            expect(Result.isOk(result)).toBe(true)
        })
    })
})