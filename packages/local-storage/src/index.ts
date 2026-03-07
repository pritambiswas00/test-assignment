import { Option, Result } from "@workspace/utils"

export type StorageErrorReason =
  | "storage_unavailable"
  | "serialization_failed"
  | "deserialization_failed"

export type StorageError = {
  reason: StorageErrorReason
  key: string
  message: string
}

export type StorageResult<T> = Result.Result<T, StorageError>

export type ValueParser<T> = (value: unknown) => StorageResult<T>

const toStorageError = (reason: StorageErrorReason, key: string, message: string): StorageError => ({
  reason,
  key,
  message,
})

const getLocalStorage = (): StorageResult<Storage> => {
  if (typeof window === "undefined" || !window.localStorage) {
    return Result.err(
      toStorageError("storage_unavailable", "__global__", "localStorage is not available in this runtime"),
    )
  }

  return Result.ok(window.localStorage)
}

const namespacedKey = (namespace: string | null, key: string): string =>
  namespace ? `${namespace}:${key}` : key

export type LocalStorageManager = {
  setItem: <T>(key: string, value: T) => StorageResult<void>
  getItem: <T>(key: string, parser?: ValueParser<T>) => StorageResult<Option.Option<T>>
  removeItem: (key: string) => StorageResult<void>
  clearNamespace: () => StorageResult<void>
}

export const createLocalStorageManager = (namespace?: string): LocalStorageManager => {
  const activeNamespace = namespace?.trim() ? namespace.trim() : null

  const setItem = <T>(key: string, value: T): StorageResult<void> => {
    return Result.match(getLocalStorage(), {
      err: (error) => Result.err(error),
      ok: (storage) => {
        try {
          storage.setItem(namespacedKey(activeNamespace, key), JSON.stringify(value))
          return Result.ok(undefined)
        } catch (error) {
          return Result.err(
            toStorageError(
              "serialization_failed",
              key,
              error instanceof Error ? error.message : "Could not serialize localStorage value",
            ),
          )
        }
      },
    })
  }

  const getItem = <T>(key: string, parser?: ValueParser<T>): StorageResult<Option.Option<T>> => {
    return Result.match(getLocalStorage(), {
      err: (error) => Result.err(error),
      ok: (storage) => {
        const rawValue = storage.getItem(namespacedKey(activeNamespace, key))
        if (rawValue === null) {
          return Result.ok(Option.none<T>())
        }

        try {
          const parsedJson: unknown = JSON.parse(rawValue)

          if (!parser) {
            return Result.ok(Option.some(parsedJson as T))
          }

          return Result.match(parser(parsedJson), {
            err: (error) => Result.err(error),
            ok: (parsedValue) => Result.ok(Option.some(parsedValue)),
          })
        } catch (error) {
          return Result.err(
            toStorageError(
              "deserialization_failed",
              key,
              error instanceof Error ? error.message : "Could not deserialize localStorage value",
            ),
          )
        }
      },
    })
  }

  const removeItem = (key: string): StorageResult<void> => {
    return Result.match(getLocalStorage(), {
      err: (error) => Result.err(error),
      ok: (storage) => {
        storage.removeItem(namespacedKey(activeNamespace, key))
        return Result.ok(undefined)
      },
    })
  }

  const clearNamespace = (): StorageResult<void> => {
    return Result.match(getLocalStorage(), {
      err: (error) => Result.err(error),
      ok: (storage) => {
        if (!activeNamespace) {
          storage.clear()
          return Result.ok(undefined)
        }

        const prefix = `${activeNamespace}:`
        const keysToDelete: string[] = []

        for (let index = 0; index < storage.length; index += 1) {
          const key = storage.key(index)
          if (key && key.startsWith(prefix)) {
            keysToDelete.push(key)
          }
        }

        keysToDelete.forEach((key) => storage.removeItem(key))
        return Result.ok(undefined)
      },
    })
  }

  return {
    setItem,
    getItem,
    removeItem,
    clearNamespace,
  } as const
}
