const escapeCharMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const PATTERN = /[&<>"']/g;

/**
 * Escapes special HTML characters in a string.
 *
 * @param {string} input - Raw string to escape.
 * @returns {string} Escaped string safe for HTML output.
 */
export function escapeHtml(input: string): string {
  return input.replace(PATTERN, (char) => escapeCharMap[char] ?? char);
}
