/**
 * ANSI color code mapping for supported foreground colors.
 *
 * These codes are used to style terminal output via escape sequences.
 */
const colorAnsiCodeMap = {
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  purple: 35,
  cyan: 36,
  white: 37,
} satisfies Record<string, number>;

/**
 * Union type of supported ANSI color names.
 */
export type AnsiColor = keyof typeof colorAnsiCodeMap;

/**
 * Wraps the given text with ANSI escape sequences to apply terminal coloring.
 *
 * @param {string} text - The text to colorize.
 * @param {AnsiColor} color - The name of the color to apply (e.g. 'blue', 'red').
 * @returns {string} The colorized text with ANSI escape sequences.
 *
 * @example
 * ```ts
 * applyAnsiColor("Hello", "green"); // "\x1b[32mHello\x1b[0m"
 * ```
 */
export function applyAnsiColor(text: string, color: AnsiColor): string {
  const code = colorAnsiCodeMap[color];
  return `\x1b[${code}m${text}\x1b[0m`;
}
