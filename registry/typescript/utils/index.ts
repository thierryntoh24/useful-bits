/**
 * A simple function to capitalize the first character of a string:
 *
 * `str.charAt(0).toUpperCase()`: Takes the first character of the string and converts it to uppercase.\
 * `str.slice(1)`: Extracts the rest of the string starting from the second character\
 * Concatenate the two parts to form the capitalized string.
 */
export function capitalizeFirstChar(str: string): string {
  if (!str) return ""; // Handle empty strings or undefined input
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Basic email validator. \
 * This ensures the email address adheres to a valid structure, such as user@example.com.
 * @param email the email string
 * @returns boolean for valid or invalid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/** Simple debounce utility. This helps prevent unnecessary API calls when users are typing.
 * Needs a node.js environment
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

/**
 * Utility to slice a string by a given number of words. (truncate) \
 * Adds an ellipsis (...) when the string is longer than the word limit.
 * 
 * @example
 * ```ts
 * sliceWords("This is a simple example sentence", 3);
// → "This is a"
* ```
 */
export function sliceWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/);
  return words.length > count ? words.slice(0, count).join(" ") + "..." : text;
}

/**Handle simple removing/adding an item from/to an array of similar items (toggling)*/
export function handleAddRemoveItem<T>({
  items,
  action,
  item,
}: {
  items: T[];
  action?: "insert" | "delete";
  item: T;
}): T[] {
  const exists = items.includes(item);

  //Custom action
  if (action === "insert") return exists ? items : [...items, item];

  if (action === "delete")
    return exists ? items.filter((id) => id !== item) : items;

  // Else toggle action
  return exists ? items.filter((id) => id !== item) : [...items, item];
}

/**
 * Simple replace-or-patch function (surface level) \
 * if you get a full object, replace it; if you get a partial object, patch it
 * @param items Array to update
 * @param id ID of particular item to update
 * @param update Partial update
 * @param options
 * @returns Updated array
 * @usage
 * 1. Patching a few fields
 * ```ts
 * setItems((prev) =>
 *  updateItemById(prev, item_id, { status: 'complete', active: true })
 * );
 * ```
 * 2. Replacing a full post
 * ```ts
 * setItems((prev) =>
 *  updateItemById(prev, item_id, updatedItem, { replace: true })
 * );
 * ```
 */
export function updateItemById<T extends { id: string }>(
  items: T[],
  id: string,
  update: Partial<Omit<T, "id">> | T,
  options?: { replace?: boolean },
): T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items; // No matching item found

  const copy = [...items];

  if (options?.replace) {
    // Full replacement: just overwrite the entire object
    copy[index] = update as T;
  } else {
    // Patch mode: merge old + new fields
    copy[index] = { ...copy[index], ...update };
  }

  return copy;
}

/**Quick safe parser for possibly undefined json */
export const safeParseJSON = <T>(value?: string): T | undefined => {
  if (!value) return undefined;

  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

/** Simple check if date is earlier than another*/
export const isEarlier = (a?: string, b?: string) => {
  if (!a || !b) return;
  return new Date(a).getTime() < new Date(b).getTime();
};
/**Simple check if date is later than another*/
export const isLater = (a?: string, b?: string) => {
  if (!a || !b) return;
  return new Date(a).getTime() > new Date(b).getTime();
};

/**
 * Simple percentage utility
 * @param value Value
 * @param total Total number
 * @param decimals Number of decimal places to return
 * @returns The percentage of `value` from `total`.
 */
export const percent = (value: number, total: number, decimals: number = 0) => {
  if (total === 0) return 0;
  const factor = 10 ** decimals;
  return Math.round((value / total) * 100 * factor) / factor;
};

/**
 * Removes undefined properties and empty objects from an object\
 * Useful before JSON.stringify or sending data to API
 */
export function cleanPayload<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries<any>(
    Object.entries(obj).filter(([, value]) => {
      if ([undefined, null, ""].includes(value)) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      if (value instanceof File && !value.name && !value.size) return false;
      if (typeof value === "object" && Object.keys(value).length === 0)
        return false;
      return true;
    }),
  ) as any;
}

type QueryValue = string | number | boolean | undefined;
/**
 * A clean query builder for filters.
 * * only defined filters
 * * booleans preserved (false must not be dropped)
 * * numbers preserved
 * * keys mapped cleanly to query params
 * @param params filter options. e,g
 * ```js
 * buildQueryParams({
 *  business_id: "abc",
 *  low_stock_only: false,
 *  search: "milk",
 *  page: 2,
 * });
 * ```
 * @returns the built query e.g `?business_id=abc&low_stock_only=false&search=milk&page=2`
 */
export function buildQueryParams<T extends Record<string, QueryValue>>(
  params?: T,
) {
  if (
    !params ||
    (typeof params === "object" && Object.keys(params).length === 0)
  )
    return "";

  return (
    "?" +
    new URLSearchParams(
      Object.entries(cleanPayload(params)).map(([k, v]) => [k, String(v)]),
    ).toString()
  );
}

/**Generic error message */
export const genericErrorState = {
  success: false,
  message: "Oops! Something went wrong. Please try again later.",
};

/**Generic network error message */
export function genericNetworkError(message: string) {
  if (message === "fetch failed")
    return {
      success: false,
      message: "Please check your network and try again.",
    };
}
