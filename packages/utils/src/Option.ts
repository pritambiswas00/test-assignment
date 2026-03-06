export type Option<T> = Some<T> | None

export type Some<T> = {
  readonly tag: "some"
  readonly value: T
}

export type None = {
  readonly tag: "none"
}

export const some = <T>(value: T): Option<T> => ({
  tag: "some",
  value,
})

export const none = <T = never>(): Option<T> => ({
  tag: "none",
})

export const isSome = <T>(option: Option<T>): option is Some<T> => option.tag === "some"

export const isNone = <T>(option: Option<T>): option is None => option.tag === "none"

export const map = <T, U>(option: Option<T>, fn: (value: T) => U): Option<U> =>
  isSome(option) ? some(fn(option.value)) : none<U>()

export const flatMap = <T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U> =>
  isSome(option) ? fn(option.value) : none<U>()

export const match = <T, U>(
  option: Option<T>,
  branches: {
    some: (value: T) => U
    none: () => U
  },
): U => (isSome(option) ? branches.some(option.value) : branches.none())

export const getOrElse = <T>(option: Option<T>, fallback: T): T =>
  isSome(option) ? option.value : fallback
