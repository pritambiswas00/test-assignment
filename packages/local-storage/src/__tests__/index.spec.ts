import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { createLocalStorageManager } from "../index"
import { Result, Option } from "@workspace/utils"

type RuntimeWithWindow = typeof globalThis & {
    window?: {
        localStorage?: Storage
    }
}

const runtime = globalThis as RuntimeWithWindow

describe("LocalStorageManager", () => {
    let store: Record<string, string> = {}

    beforeEach(() => {
        store = {}
        const mockLocalStorage: Storage = {
            get length() {
                return Object.keys(store).length
            },
            getItem: (key: string) => store[key] ?? null,
            setItem: (key: string, value: string) => {
                store[key] = value
            },
            removeItem: (key: string) => {
                delete store[key]
            },
            clear: () => {
                store = {}
            },
            key: (index: number) => Object.keys(store)[index] ?? null,
        }

        Object.defineProperty(runtime, "window", {
            value: {
                localStorage: mockLocalStorage,
            },
            writable: true,
            configurable: true,
        })
    })

    afterEach(() => {
        store = {}
    })

    describe("setItem", () => {
        it("should set item successfully", () => {
            const manager = createLocalStorageManager()
            const result = manager.setItem("key", { value: "test" })
            expect(Result.isOk(result)).toBe(true)
            expect(store["key"]).toBe(JSON.stringify({ value: "test" }))
        })

        it("should namespace keys", () => {
            const manager = createLocalStorageManager("app")
            manager.setItem("key", "value")
            expect(store["app:key"]).toBe(JSON.stringify("value"))
        })

        it("should handle serialization errors", () => {
            const manager = createLocalStorageManager()
            const circular: { self?: unknown } = {}
            circular.self = circular
            const result = manager.setItem("key", circular)
            expect(Result.isErr(result)).toBe(true)
            if (Result.isErr(result)) {
                expect(result.error.reason).toBe("serialization_failed")
            }
        })
    })

    describe("getItem", () => {
        it("should retrieve item successfully", () => {
            store["key"] = JSON.stringify("value")
            const manager = createLocalStorageManager()
            const result = manager.getItem("key")
            expect(Result.isOk(result)).toBe(true)
            if (Result.isOk(result)) {
                expect(Option.isSome(result.value)).toBe(true)
            }
        })

        it("should return none for missing item", () => {
            const manager = createLocalStorageManager()
            const result = manager.getItem("missing")
            expect(Result.isOk(result)).toBe(true)
            if (Result.isOk(result)) {
                expect(Option.isNone(result.value)).toBe(true)
            }
        })

        it("should parse with custom parser", () => {
            store["key"] = JSON.stringify(42)
            const manager = createLocalStorageManager()
            const parser = (v: unknown) =>
                Number.isInteger(v)
                    ? Result.ok(v as number)
                    : Result.err({ reason: "deserialization_failed" as const, key: "key", message: "Not a number" })
            const result = manager.getItem("key", parser)
            expect(Result.isOk(result)).toBe(true)
        })

        it("should handle deserialization errors", () => {
            store["key"] = "invalid json"
            const manager = createLocalStorageManager()
            const result = manager.getItem("key")
            expect(Result.isErr(result)).toBe(true)
            if (Result.isErr(result)) {
                expect(result.error.reason).toBe("deserialization_failed")
            }
        })
    })

    describe("removeItem", () => {
        it("should remove item successfully", () => {
            store["key"] = "value"
            const manager = createLocalStorageManager()
            const result = manager.removeItem("key")
            expect(Result.isOk(result)).toBe(true)
            expect(store["key"]).toBeUndefined()
        })
    })

    describe("clearNamespace", () => {
        it("should clear all when no namespace", () => {
            store["key1"] = "value1"
            store["key2"] = "value2"
            const manager = createLocalStorageManager()
            manager.clearNamespace()
            expect(Object.keys(store).length).toBe(0)
        })

        it("should clear only namespaced keys", () => {
            store["app:key1"] = "value1"
            store["app:key2"] = "value2"
            store["other:key"] = "value"
            const manager = createLocalStorageManager("app")
            manager.clearNamespace()
            expect(store["app:key1"]).toBeUndefined()
            expect(store["app:key2"]).toBeUndefined()
            expect(store["other:key"]).toBe("value")
        })
    })

    describe("storage unavailable", () => {
        it("should handle undefined localStorage", () => {
            const original = runtime.window
            Object.defineProperty(runtime, "window", {
                value: {
                    localStorage: undefined,
                },
                writable: true,
                configurable: true,
            })
            const manager = createLocalStorageManager()
            const result = manager.setItem("key", "value")
            expect(Result.isErr(result)).toBe(true)
            if (Result.isErr(result)) {
                expect(result.error.reason).toBe("storage_unavailable")
            }
            Object.defineProperty(runtime, "window", {
                value: original,
                writable: true,
                configurable: true,
            })
        })
    })
})