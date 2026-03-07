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
    const storageResult = getLocalStorage()
    if (storageResult.tag === "err") {
      return storageResult
    }

    try {
      storageResult.value.setItem(namespacedKey(activeNamespace, key), JSON.stringify(value))
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
  }

  const getItem = <T>(key: string, parser?: ValueParser<T>): StorageResult<Option.Option<T>> => {
    const storageResult = getLocalStorage()
    if (storageResult.tag === "err") {
      return storageResult
    }

    const rawValue = storageResult.value.getItem(namespacedKey(activeNamespace, key))
    if (rawValue === null) {
      return Result.ok(Option.none<T>())
    }

    try {
      const parsedJson: unknown = JSON.parse(rawValue)

      if (!parser) {
        return Result.ok(Option.some(parsedJson as T))
      }

      const parsedValue = parser(parsedJson)
      if (parsedValue.tag === "err") {
        return parsedValue
      }
      return Result.ok(Option.some(parsedValue.value))
    } catch (error) {
      return Result.err(
        toStorageError(
          "deserialization_failed",
          key,
          error instanceof Error ? error.message : "Could not deserialize localStorage value",
        ),
      )
    }
  }

  const removeItem = (key: string): StorageResult<void> => {
    const storageResult = getLocalStorage()
    if (storageResult.tag === "err") {
      return storageResult
    }

    storageResult.value.removeItem(namespacedKey(activeNamespace, key))
    return Result.ok(undefined)
  }

  const clearNamespace = (): StorageResult<void> => {
    const storageResult = getLocalStorage()
    if (storageResult.tag === "err") {
      return storageResult
    }

    if (!activeNamespace) {
      storageResult.value.clear()
      return Result.ok(undefined)
    }

    const prefix = `${activeNamespace}:`
    const keysToDelete: string[] = []

    for (let index = 0; index < storageResult.value.length; index += 1) {
      const key = storageResult.value.key(index)
      if (key && key.startsWith(prefix)) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => storageResult.value.removeItem(key))
    return Result.ok(undefined)
  }

  return {
    setItem,
    getItem,
    removeItem,
    clearNamespace,
  } as const
}
