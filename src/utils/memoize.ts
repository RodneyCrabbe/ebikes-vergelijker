/**
 * Simple memoization utility for caching function results
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Generate a hash from filter object for caching
 */
export function hashFilters(filters: Record<string, any>): string {
  const sorted = Object.keys(filters)
    .sort()
    .map(key => `${key}:${JSON.stringify(filters[key])}`)
    .join('|')
  return sorted
}



