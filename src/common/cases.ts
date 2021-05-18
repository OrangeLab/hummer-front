/**
 * Any Case => Lower Case
 * ex.
 * Border => border
 * @param key 
 * @returns 
 */
export function toLowerCase(key: string): string {
  return key.toLowerCase()
}


/**
 * Any Case => Upper Case
 * ex.
 * border => BORDER
 * @param key 
 * @returns 
 */
export function toUpperCase(key: string): string {
  return key.toUpperCase()
}

/**
 * Kebab Case ==> Camel Case
 * ex.
 * border-width => borderWidth
 * @param key string
 * @returns string
 */
export function toCamelKey(key: string): string {
  let humpKey = key.replace(/-(\w)/g, ($0, $1) => {
    return $1.toUpperCase()
  })
  return humpKey
}

/**
 * Camel Case ==> Kebab Case
 * ex.
 * borderWidth => border-width
 * ps.
 * 首字母大写时，前缀不增加 - 符号
 * @param key string
 * @returns string
 */
export function toKebabCase(key: string): string {
  return key.replace(/[A-Z]/g, ($0: string, offset: number) => {
    return (offset === 0 ? '' : '-') + $0.toLowerCase()
  })
}