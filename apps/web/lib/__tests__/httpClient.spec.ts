import { beforeEach, describe, expect, it, vi } from "vitest"

const mockHttpClient = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
}))

vi.mock("@/env", () => ({
    env: {
        EXTERNAL_SERVER_API: "https://example.test",
    },
}))

vi.mock("@workspace/http-client", () => ({
    createHttpClient: vi.fn(() => mockHttpClient),
}))

import { deleteFromApi, getFromApi, patchToApi, postToApi, putToApi } from "../httpClient"

describe('httpClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getFromApi', () => {
        it('should call httpClient.get with path and config', async () => {
            const mockResult = { success: true, data: { id: 1 } }
            mockHttpClient.get.mockResolvedValue(mockResult)

            const result = await getFromApi('/test', { headers: { 'X-Custom': 'header' } })

            expect(mockHttpClient.get).toHaveBeenCalledWith('/test', { headers: { 'X-Custom': 'header' } })
            expect(result).toEqual(mockResult)
        })
    })

    describe('postToApi', () => {
        it('should call httpClient.post with path, body, and config', async () => {
            const mockResult = { success: true, data: { id: 2 } }
            const body = { name: 'test' }
            mockHttpClient.post.mockResolvedValue(mockResult)

            const result = await postToApi('/test', body, { headers: { 'X-Custom': 'header' } })

            expect(mockHttpClient.post).toHaveBeenCalledWith('/test', body, { headers: { 'X-Custom': 'header' } })
            expect(result).toEqual(mockResult)
        })
    })

    describe('putToApi', () => {
        it('should call httpClient.put with path, body, and config', async () => {
            const mockResult = { success: true, data: { id: 3 } }
            const body = { name: 'updated' }
            mockHttpClient.put.mockResolvedValue(mockResult)

            const result = await putToApi('/test', body)

            expect(mockHttpClient.put).toHaveBeenCalledWith('/test', body, undefined)
            expect(result).toEqual(mockResult)
        })
    })

    describe('patchToApi', () => {
        it('should call httpClient.patch with path, body, and config', async () => {
            const mockResult = { success: true, data: { id: 4 } }
            const body = { status: 'active' }
            mockHttpClient.patch.mockResolvedValue(mockResult)

            const result = await patchToApi('/test', body)

            expect(mockHttpClient.patch).toHaveBeenCalledWith('/test', body, undefined)
            expect(result).toEqual(mockResult)
        })
    })

    describe('deleteFromApi', () => {
        it('should call httpClient.delete with path and config', async () => {
            const mockResult = { success: true, data: null }
            mockHttpClient.delete.mockResolvedValue(mockResult)

            const result = await deleteFromApi('/test', { headers: { 'X-Custom': 'header' } })

            expect(mockHttpClient.delete).toHaveBeenCalledWith('/test', { headers: { 'X-Custom': 'header' } })
            expect(result).toEqual(mockResult)
        })
    })
})