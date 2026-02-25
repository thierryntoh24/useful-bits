/**
 * Utility to lock/unlock scrolling on elements without hiding the scrollbar
 *
 * @remarks
 * Uses passive event listeners and `preventDefault` to
 * block native scroll behaviour.
 *
 * @module scroll-lock
 */

// Store original positions to restore later
const scrollPositions = new Map<HTMLElement, number>();

// Prevent default event handler (consistent reference)
const preventDefault = (e: Event): void => {
  e.stopPropagation();
  e.preventDefault();
};

/**
 * Lock scrolling on an element while preserving the scrollbar visibility.
 * Safe to call multiple times on the same element —
 * subsequent calls are no-ops until {@link unlockScroll} is called.
 *
 * @example
 * ```ts
 * // Lock the whole page
 * lockScroll(document.documentElement);
 *
 * // Lock a specific scrollable container
 * lockScroll(document.getElementById("modal-body")!);
 * ```
 * @param element - The scrollable element to lock
 */
export const lockScroll = (element: HTMLElement): void => {
  if (scrollPositions.has(element)) return;

  // Store the current scroll position
  scrollPositions.set(element, element.scrollTop);

  // Add event listeners to prevent scroll events
  element.addEventListener("wheel", preventDefault, { passive: false });
  element.addEventListener("touchmove", preventDefault, { passive: false });
  // Can add other listeners like arrow keys, spacebar, etc.

  // Apply CSS that keeps scrollbar visible but prevents scrolling
  const originalPosition = window.getComputedStyle(element).position;
  if (originalPosition === "static") {
    element.style.position = "relative";
  }

  // Set a data attribute to track the original position for restoration
  element.dataset.originalPosition = originalPosition;
};

/**
 * Unlock scrolling on an element and restore its listeners
 * Safe to call on elements that were never locked — those calls are silently ignored.
 *
 * @example
 * ```ts
 * unlockScroll(document.documentElement);
 * ```
 * @param element - The scrollable element to unlock
 */
export const unlockScroll = (element: HTMLElement): void => {
  // Remove event listeners (using the same reference)
  element.removeEventListener("wheel", preventDefault);
  element.removeEventListener("touchmove", preventDefault);
  // Can add other listeners like arrow keys, spacebar, etc.

  // Restore original position if needed
  if (element.dataset.originalPosition) {
    element.style.position = element.dataset.originalPosition;
    delete element.dataset.originalPosition;
  }

  // Restore the original scroll position
  const savedPosition = scrollPositions.get(element);
  if (savedPosition !== undefined) {
    element.scrollTop = savedPosition;
    scrollPositions.delete(element);
  }
};

/**
 * Returns whether scrolling is currently locked on the given element.
 *
 * @param element - The element to check.
 * @returns `true` if the element is currently scroll-locked.
 */
export function isScrollLocked(element: HTMLElement): boolean {
  return scrollPositions.has(element);
}

/**
 * Unlocks all currently locked elements, restoring each to its original state.
 * Useful for cleanup in app teardown or navigation events.
 */
export function unlockAllScrolls(): void {
  for (const element of scrollPositions.keys()) {
    unlockScroll(element);
  }
}
