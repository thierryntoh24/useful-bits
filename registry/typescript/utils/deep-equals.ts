/**
 * A clean, lightweight deepEqual helper that works in the browser, is dependency-free, and handles:
 * - Objects
 * - Arrays
 * - Primitives
 * - null, undefined
 * - Dates, functions, etc. (with some limitations)
 *
 * Think of it as `a === b`.
 * @param a value to compare
 * @param b value comparing against
 * @returns boolean representing whether `a` is same as `b`.
 */

export function isDeepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;

  if (a === null || b === null || typeof a !== "object") return false;

  // Compare arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => isDeepEqual(item, b[i]));
  }

  // If only one is array
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => isDeepEqual(a[key], b[key]));
}
