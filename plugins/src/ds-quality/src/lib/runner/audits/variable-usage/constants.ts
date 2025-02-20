/**
 * Matches CSS custom property names (e.g., --my-variable)
 *
 * @example
 * ```ts
 * const matches = "background: linear-gradient(var(--primary-color), var(--secondary-color), var(--accent-color));".match(cssVariableRegex);
 * console.log(matches); // ['primary-color', 'secondary-color', 'accent-color']
 * ```
 */
export const extractCssVariableNameRegex = /var\(--([\w-]+)\)/g;
