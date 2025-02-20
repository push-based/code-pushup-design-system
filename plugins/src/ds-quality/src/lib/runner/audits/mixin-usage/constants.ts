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

/**
 * A regex that matches a AtRule param
 *
 * @example
 *
 * const useImportRegex = /['"]([^'"]+)['"]\s+as\s+([\w-]+)/;
 *
 * // Case 1: Single quotes
 * console.log("'./single-mixin' as single-mixin".match(useImportRegex));
 * // Output: ["'./single-mixin' as single-mixin", "./single-mixin", "single-mixin"]
 *
 * // Case 2: Double quotes
 * console.log('"styles/mixins" as mx'.match(useImportRegex));
 * // Output: ['"styles/mixins" as mx', "styles/mixins", "mx"]
 *
 * // Case 3: Hyphenated alias
 * console.log("'theme/colors' as color-utils".match(useImportRegex));
 * // Output: ["'theme/colors' as color-utils", "theme/colors", "color-utils"]
 *
 */
export const useImportRegex = /['"]([^'"]+)['"]\s+as\s+([\w-]+)/;
