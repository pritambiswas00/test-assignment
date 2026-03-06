export type Result<T, E> = Ok<T> | Err<E>

export type Ok<T> = {
  readonly tag: "ok"
  readonly value: T
}

export type Err<E> = {
  readonly tag: "err"
  readonly error: E
}

export const ok = <T, E = never>(value: T): Result<T, E> => ({
  tag: "ok",
  value,
})

export const err = <E, T = never>(error: E): Result<T, E> => ({
  tag: "err",
  error,
})

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.tag === "ok"

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => result.tag === "err"

export const map = <T, E, U>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> =>
  isOk(result) ? ok<U, E>(fn(result.value)) : err<E, U>(result.error)

export const mapErr = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> =>
  isErr(result) ? err<F, T>(fn(result.error)) : ok<T, F>(result.value)

export const flatMap = <T, E, U>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => (isOk(result) ? fn(result.value) : err<E, U>(result.error))

export const match = <T, E, U>(
  result: Result<T, E>,
  branches: {
    ok: (value: T) => U
    err: (error: E) => U
  },
): U => (isOk(result) ? branches.ok(result.value) : branches.err(result.error))

export const unwrapOr = <T, E>(result: Result<T, E>, fallback: T): T =>
  isOk(result) ? result.value : fallback
