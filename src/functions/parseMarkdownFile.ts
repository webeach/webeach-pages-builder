import fs from 'node:fs';

import { parseMarkdownContent } from './parseMarkdownContent';

/**
 * Reads and parses a Markdown file into an Abstract Syntax Tree (AST).
 *
 * This function:
 * 1. Reads the Markdown file asynchronously.
 * 2. Converts the file content to a string.
 * 3. Passes the content to `parseMarkdownContent` for parsing and processing.
 *
 * @param {string} path - The file path to the Markdown file.
 * @returns {Promise<import('mdast').Root>} A promise resolving to the processed Markdown AST.
 *
 * **Example Usage:**
 * ```ts
 * const parsedTree = await parseMarkdownFile("./docs/example.md");
 * console.log(parsedTree);
 * ```
 *
 * **Throws:**
 * - `Error` if the file cannot be read.
 */
export async function parseMarkdownFile(path: string) {
  // Read the Markdown file as a Buffer
  const fileContent = await fs.promises.readFile(path);

  // Convert file content to a string and parse it into an AST
  return await parseMarkdownContent(fileContent.toString());
}
