import { describe, it, expect } from 'vitest'
import {

some,
none,
isSome,
isNone,
map,
flatMap,
match,
getOrElse,
toOption,
type Option,
} from '../Option.js'

describe('Option', () => {
describe('some', () => {
    it('should create a Some with a value', () => {
        const result = some(42)
        expect(result.tag).toBe('some')
        if(result.tag === 'some') {
            expect(result.value).toBe(42)
        }
    })
})

describe('none', () => {
    it('should create a None', () => {
        const result = none()
        expect(result.tag).toBe('none')
    })
})

describe('isSome', () => {
    it('should return true for Some', () => {
        expect(isSome(some(42))).toBe(true)
    })

    it('should return false for None', () => {
        expect(isSome(none())).toBe(false)
    })
})

describe('isNone', () => {
    it('should return false for Some', () => {
        expect(isNone(some(42))).toBe(false)
    })

    it('should return true for None', () => {
        expect(isNone(none())).toBe(true)
    })
})

describe('map', () => {
    it('should apply function to Some value', () => {
        const result = map(some(5), (x) => x * 2)
        expect(isSome(result)).toBe(true)
        expect((result as any).value).toBe(10)
    })

    it('should return None for None', () => {
        const result = map(none<number>(), (x) => x * 2)
        expect(isNone(result)).toBe(true)
    })
})

describe('flatMap', () => {
    it('should apply function returning Option to Some', () => {
        const result = flatMap(some(5), (x) => some(x * 2))
        expect(isSome(result)).toBe(true)
        expect((result as any).value).toBe(10)
    })

    it('should return None from function', () => {
        const result = flatMap(some(5), () => none<number>())
        expect(isNone(result)).toBe(true)
    })

    it('should return None for None input', () => {
        const result = flatMap(none<number>(), (x) => some(x * 2))
        expect(isNone(result)).toBe(true)
    })
})

describe('match', () => {
    it('should execute some branch for Some', () => {
        const result = match(some(42), {
            some: (x) => x * 2,
            none: () => 0,
        })
        expect(result).toBe(84)
    })

    it('should execute none branch for None', () => {
        const result = match(none<number>(), {
            some: (x) => x * 2,
            none: () => 0,
        })
        expect(result).toBe(0)
    })
})

describe('getOrElse', () => {
    it('should return value for Some', () => {
        const result = getOrElse(some(42), 0)
        expect(result).toBe(42)
    })

    it('should return fallback for None', () => {
        const result = getOrElse(none<number>(), 0)
        expect(result).toBe(0)
    })
})

describe('toOption', () => {
    it('should create Some for non-null value', () => {
        const result = toOption(42)
        expect(isSome(result)).toBe(true)
        expect((result as any).value).toBe(42)
    })

    it('should create None for null', () => {
        const result = toOption(null)
        expect(isNone(result)).toBe(true)
    })

    it('should create None for undefined', () => {
        const result = toOption(undefined)
        expect(isNone(result)).toBe(true)
    })
})
})