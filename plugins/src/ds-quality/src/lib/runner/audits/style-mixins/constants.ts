/**
 * Regex to extract SCSS mixin names from `@mixin` declarations.
 *
 * Pattern Breakdown:
 * - `^@mixin` ➝ Matches the `@mixin` keyword at the start of a line.
 * - `\s+` ➝ Allows flexible spacing.
 * - `([\w-]+)` ➝ Captures mixin names (letters, numbers, hyphens, underscores).
 *
 * Example Matches:
 * - `@mixin button-style {` ➝ `"button-style"`
 * - `@mixin border-radius-42 {` ➝ `"border-radius-42"`
 *
 * Usage:
 * ```js
 * const matches = [...cssCode.matchAll(extractMixinNameRegex)].map(m => m[1]);
 * ```
 */
export const extractMixinNameRegex = /^@mixin\s+([\w-]+)/;
