import { beforeEach, describe, expect, it, vi } from "vitest"
import { Option, Result } from "@workspace/utils"

const mockGetFromApi = vi.hoisted(() => vi.fn())

vi.mock("@/env", () => ({
    env: {
        EXTERNAL_SERVER_API: "https://example.test",
    },
}))

vi.mock("@/lib/httpClient", () => ({
    getFromApi: mockGetFromApi,
}))

vi.mock("./common", () => ({
    formatEndpointError: vi.fn((endpoint, message) => `${endpoint}: ${message}`),
}))

import * as httpClient from "@/lib/httpClient"
import { getProductById, getProducts } from "../productsApi"

const mockHeaders = {} as Record<string, string>

const httpOk = <T>(data: T, status = 200) => Result.ok({ data, status, headers: mockHeaders })

const httpErr = (message: string, status?: number) =>
    Result.err({
        message,
        status: status === undefined ? Option.none<number>() : Option.some(status),
        code: Option.none<string>(),
        details: Option.none<unknown>(),
    })

const createMockProduct = () => ({
    id: 1,
    title: "Product 1",
    description: "Description",
    category: "beauty",
    price: 10,
    discountPercentage: 5,
    rating: 4.5,
    stock: 100,
    tags: ["tag-1"],
    sku: "SKU-1",
    weight: 1,
    dimensions: {
        width: 1,
        height: 1,
        depth: 1,
    },
    warrantyInformation: "1 year",
    shippingInformation: "Ships in 1 day",
    availabilityStatus: "In Stock" as const,
    reviews: [
        {
            rating: 5,
            comment: "Great",
            date: "2026-01-01",
            reviewerName: "Alex",
            reviewerEmail: "alex@example.com",
        },
    ],
    returnPolicy: "30 days",
    minimumOrderQuantity: 1,
    meta: {
        createdAt: "2026-01-01",
        updatedAt: "2026-01-02",
        barcode: "123456",
        qrCode: "https://example.test/qr",
    },
    images: ["https://example.test/image-1.png"],
    thumbnail: "https://example.test/thumb.png",
})

describe("productsApi", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("getProducts", () => {
        it("should return products on successful request", async () => {
            const mockData = {
                products: [createMockProduct()],
                total: 1,
                skip: 0,
                limit: 30,
            }
            vi.mocked(httpClient.getFromApi).mockResolvedValueOnce(httpOk(mockData))

            const result = await getProducts()

            expect(result.tag).toBe("ok")
            if (result.tag === "ok") {
                expect(result.value.products).toHaveLength(1)
            }
        })

        it("should return error on failed request", async () => {
            vi.mocked(httpClient.getFromApi).mockResolvedValueOnce(
                httpErr("Network error", 500),
            )

            const result = await getProducts()

            expect(result.tag).toBe("err")
            if (result.tag === "err") {
                expect(result.error.reason).toBe("request_failed")
            }
        })

        it("should return validation error on invalid payload", async () => {
            vi.mocked(httpClient.getFromApi).mockResolvedValueOnce(httpOk({}))

            const result = await getProducts()

            expect(result.tag).toBe("err")
            if (result.tag === "err") {
                expect(result.error.reason).toBe("invalid_payload")
            }
    })
    })

    describe("getProductById", () => {
        it("should return product on successful request", async () => {
            const mockProduct = createMockProduct()
            vi.mocked(httpClient.getFromApi).mockResolvedValueOnce(httpOk(mockProduct))

            const result = await getProductById(1)

            expect(result.tag).toBe("ok")
            if (result.tag === "ok") {
                expect(result.value.id).toBe(1)
            }
        })

        it("should return error on failed request", async () => {
            vi.mocked(httpClient.getFromApi).mockResolvedValueOnce(
                httpErr("Not found", 404),
            )

            const result = await getProductById(999)

            expect(result.tag).toBe("err")
            if (result.tag === "err") {
                expect(result.error.reason).toBe("request_failed")
                expect(result.error.status).toBe(404)
            }
        })

        it("should return validation error on invalid product payload", async () => {
            vi.mocked(httpClient.getFromApi).mockResolvedValueOnce(
                httpOk({ invalid: "data" }),
            )

            const result = await getProductById(1)

            expect(result.tag).toBe("err")
            if (result.tag === "err") {
                expect(result.error.reason).toBe("invalid_payload")
            }
    })
    })
})