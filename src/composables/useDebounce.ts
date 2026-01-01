import { ref, watch, type Ref } from 'vue'

/**
 * Composable for debouncing a ref value
 * @param source - The ref to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns A debounced ref
 */
export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(
    source,
    (newValue) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        debounced.value = newValue
        timeoutId = null
      }, delay)
    },
    { immediate: true }
  )

  return debounced
}

/**
 * Composable for debouncing a function call
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns A debounced function
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

