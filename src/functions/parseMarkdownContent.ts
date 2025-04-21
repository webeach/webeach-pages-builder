import { Root } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { removePosition } from 'unist-util-remove-position';

import { remarkCodeToHtml } from '../plugins/ramarkCodeToHtml';
import { remarkSection } from '../plugins/ramarkSection';
import { remarkCodeMetaData } from '../plugins/remarkCodeMetaData';
import { remarkWidget } from '../plugins/remarkWidget';

/**
 * Parses and transforms Markdown content into an MDAST (Markdown AST) using Unified and Remark plugins.
 *
 * This function performs the following steps:
 * 1. Parses raw Markdown content into an AST using `remark-parse`.
 * 2. Enables GitHub Flavored Markdown features via `remark-gfm`.
 * 3. Extracts metadata from code blocks using `remarkCodeMetaData`.
 * 4. Converts special YAML code blocks into widgets using `remarkWidget`.
 * 5. Converts code blocks into syntax-highlighted HTML using `remarkCodeToHtml`.
 * 6. Wraps sections using `remarkSection` for structured layouts.
 * 7. Removes positional metadata from the resulting tree to simplify output.
 *
 * @param {string} content - Raw Markdown content to parse and process.
 * @returns {Promise<Root>} A promise resolving to the processed MDAST.
 *
 * @example
 * ```ts
 * const markdown = `
 * ## Example
 *
 * \`\`\`yaml widget="TestWidget"
 * title: "Hello"
 * description: "Widget description"
 * \`\`\`
 * `;
 *
 * const tree = await parseMarkdownContent(markdown);
 * console.log(tree); // Parsed and transformed AST
 * ```
 */
export async function parseMarkdownContent(content: string): Promise<Root> {
  const parser = unified()
    .use(remarkParse) // Parses basic Markdown syntax into MDAST
    .use(remarkGfm) // Enables tables, autolinks, strikethrough, etc.
    .use(remarkCodeMetaData) // Extracts metadata from code blocks (like language, widget hints)
    .use(remarkWidget) // Transforms widget code blocks into widget nodes
    .use(remarkCodeToHtml) // Converts code blocks into HTML AST nodes with token classes
    .use(remarkSection); // Groups content into semantic sections

  const tree = parser.parse(content); // Convert Markdown string to raw MDAST
  const result = await parser.run(tree); // Apply transformations

  removePosition(result, { force: true }); // Strip location metadata for cleaner output

  return result;
}
