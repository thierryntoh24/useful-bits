/**
 * Utility to lock/unlock scrolling on elements without causing layout shift.
 *
 * @remarks
 * Uses `overflow: hidden` + scrollbar-width compensation rather than passive
 * event listeners, which cannot call `preventDefault` and therefore cannot
 * block native scroll behaviour.
 *
 * @module scroll-lock
 */

/** Saved state for a locked element so it can be fully restored later. */
interface LockedState {
  /** The element's `overflow` value before locking. */
  overflow: string;
  /** The element's `paddingRight` value before locking. */
  paddingRight: string;
  /** The scroll position at the time of locking. */
  scrollTop: number;
}

/** Internal registry of locked elements and their original state. */
const lockedElements = new Map<HTMLElement, LockedState>();

/**
 * Returns the width of the visible scrollbar for a given element (or the
 * window scrollbar when `document.documentElement` is passed).
 *
 * @param element - The element to measure.
 * @returns Scrollbar width in pixels.
 */
function getScrollbarWidth(element: HTMLElement): number {
  // For the root element or body, measure against the window.
  // Using the root element is preferable here.
  if (element === document.documentElement) {
    return window.innerWidth - document.documentElement.clientWidth;
  }
  if (element === document.body) {
    return window.innerWidth - document.body.clientWidth;
  }
  return element.offsetWidth - element.clientWidth;
}

/**
 * Locks scrolling on the given element while preserving scrollbar space to
 * avoid layout shift. Safe to call multiple times on the same element —
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
 *
 * @param element - The scrollable element to lock.
 */
export function lockScroll(element: HTMLElement): void {
  if (lockedElements.has(element)) return;

  const computed = window.getComputedStyle(element);
  const scrollbarWidth = getScrollbarWidth(element);

  lockedElements.set(element, {
    overflow: element.style.overflow,
    paddingRight: element.style.paddingRight,
    scrollTop: element.scrollTop,
  });

  // Compensate for the scrollbar disappearing so content doesn't shift.
  if (scrollbarWidth > 0) {
    const currentPadding = parseFloat(computed.paddingRight) || 0;
    element.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }

  element.style.overflow = "hidden";
}

/**
 * Unlocks scrolling on the given element and restores its original scroll
 * position, padding, and overflow. Safe to call on elements that were never
 * locked — those calls are silently ignored.
 *
 * @example
 * ```ts
 * unlockScroll(document.documentElement);
 * ```
 *
 * @param element - The element to unlock.
 */
export function unlockScroll(element: HTMLElement): void {
  const state = lockedElements.get(element);
  if (!state) return;

  element.style.overflow = state.overflow;
  element.style.paddingRight = state.paddingRight;

  // Restore the scroll position the user was at before the lock.
  element.scrollTop = state.scrollTop;

  lockedElements.delete(element);
}

/**
 * Returns whether scrolling is currently locked on the given element.
 *
 * @param element - The element to check.
 * @returns `true` if the element is currently scroll-locked.
 */
export function isScrollLocked(element: HTMLElement): boolean {
  return lockedElements.has(element);
}

/**
 * Unlocks all currently locked elements, restoring each to its original state.
 * Useful for cleanup in app teardown or navigation events.
 */
export function unlockAllScrolls(): void {
  for (const element of lockedElements.keys()) {
    unlockScroll(element);
  }
}
