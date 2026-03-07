import { describe, it, expect } from "vitest"
import { ok, err, isOk, isErr, map, mapErr, flatMap, match, unwrapOr } from "../Result.js"

describe("Result", () => {
    describe("ok", () => {
        it("should create an Ok result", () => {
            const result = ok(42)
            expect(result.tag).toBe("ok")
            if (result.tag === "ok") {
                expect(result.value).toBe(42)
            }
        })
    })

    describe("err", () => {
        it("should create an Err result", () => {
            const result = err("error message")
            expect(result.tag).toBe("err")
            if (result.tag === "err") {
                expect(result.error).toBe("error message")
            }
        })
    })

    describe("isOk", () => {
        it("should return true for Ok results", () => {
            expect(isOk(ok(42))).toBe(true)
        })

        it("should return false for Err results", () => {
            expect(isOk(err("error"))).toBe(false)
        })
    })

    describe("isErr", () => {
        it("should return true for Err results", () => {
            expect(isErr(err("error"))).toBe(true)
        })

        it("should return false for Ok results", () => {
            expect(isErr(ok(42))).toBe(false)
        })
    })

    describe("map", () => {
        it("should transform Ok value", () => {
            const result = map(ok(5), (x) => x * 2)
            expect(isOk(result)).toBe(true)
            if (isOk(result)) {
                expect(result.value).toBe(10)
            }
        })

        it("should preserve Err", () => {
            const result = map(err("error"), (x: number) => x * 2)
            expect(isErr(result)).toBe(true)
            if (isErr(result)) {
                expect(result.error).toBe("error")
            }
        })
    })

    describe("mapErr", () => {
        it("should transform Err value", () => {
            const result = mapErr(err("error"), (e) => e.toUpperCase())
            expect(isErr(result)).toBe(true)
            if (isErr(result)) {
                expect(result.error).toBe("ERROR")
            }
        })

        it("should preserve Ok", () => {
            const result = mapErr(ok(42), (e: string) => e.toUpperCase())
            expect(isOk(result)).toBe(true)
            if (isOk(result)) {
                expect(result.value).toBe(42)
            }
        })
    })

    describe("flatMap", () => {
        it("should chain Ok results", () => {
            const result = flatMap(ok(5), (x) => ok(x * 2))
            expect(isOk(result)).toBe(true)
            if (isOk(result)) {
                expect(result.value).toBe(10)
            }
        })

        it("should return Err from chain", () => {
            const result = flatMap(ok(5), () => err("error"))
            expect(isErr(result)).toBe(true)
            if (isErr(result)) {
                expect(result.error).toBe("error")
            }
        })

        it("should preserve initial Err", () => {
            const result = flatMap(err("error"), (x) => ok(x * 2))
            expect(isErr(result)).toBe(true)
            if (isErr(result)) {
                expect(result.error).toBe("error")
            }
        })
    })

    describe("match", () => {
        it("should call ok branch for Ok results", () => {
            const result = match(ok(42), {
                ok: (value) => value * 2,
                err: () => 0,
            })
            expect(result).toBe(84)
        })

        it("should call err branch for Err results", () => {
            const result = match(err("error"), {
                ok: () => 0,
                err: (error) => error.length,
            })
            expect(result).toBe(5)
        })
    })

    describe("unwrapOr", () => {
        it("should return Ok value", () => {
            const result = unwrapOr(ok(42), 0)
            expect(result).toBe(42)
        })

        it("should return fallback for Err", () => {
            const result = unwrapOr(err("error"), 0)
            expect(result).toBe(0)
        })
    })
})