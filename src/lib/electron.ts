/**
 * Utilities for detecting and interacting with the Electron environment.
 */

/** Returns true when the renderer is running inside Electron. */
export function isElectron(): boolean {
  return typeof window !== "undefined" && typeof window.theo !== "undefined";
}

/**
 * Returns the `window.theo` bridge, throwing if not in Electron.
 * Use `isElectron()` to guard before calling this.
 */
export function getTheo(): NonNullable<Window["theo"]> {
  if (typeof window === "undefined" || !window.theo) {
    throw new Error(
      "window.theo is not available — this code must run inside Electron."
    );
  }
  return window.theo;
}
