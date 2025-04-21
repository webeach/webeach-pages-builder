import { LangKey, parseCodeToHtml } from '@webeach/code-parser';
import { Root } from 'mdast';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that converts code blocks to syntax-highlighted HTML.
 *
 * This plugin visits all `code` nodes in the Markdown AST and transforms their raw `value`
 * into a pre-rendered HTML string stored in `valueHtml`. The original `value` is cleared
 * to avoid duplication in the output.
 *
 * Syntax highlighting is performed using `@webeach/code-parser` based on the block's `lang`.
 *
 * If the language is not supported by `@webeach/code-parser`, the plugin logs a warning
 * and leaves the code block unchanged (no `valueHtml` will be set).
 *
 * Useful for:
 * - Rendering Markdown as structured JSON (e.g. for static sites or custom frontends).
 * - Performing syntax highlighting at build-time instead of runtime.
 *
 * ---
 *
 * 🔧 Requirements:
 * - The `lang` property should be a valid `LangKey` supported by the code parser.
 *
 * ---
 *
 * @example Input Markdown:
 * ```md
 *     \`\`\`ts
 *     const a = 1;
 *     \`\`\`
 * ```
 *
 * @example Resulting node:
 * ```ts
 * {
 *   type: 'code',
 *   lang: 'ts',
 *   value: '',
 *   valueHtml: '<span class="_token-keyword">const</span> <span class="_token-operator">=</span> <span class="_token-number">1</span>;'
 * }
 * ```
 *
 * @returns A Unified-compatible plugin that transforms code blocks into HTML.
 */
export const remarkCodeToHtml: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      // Convert the raw code value to highlighted HTML
      try {
        node.valueHtml = parseCodeToHtml(
          node.value,
          (node.lang as LangKey) ?? null,
        );

        // Clear the original code string to avoid duplication
        node.value = '';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        console.warn(`Unknown language: "${node.lang}" is not registered`);
      }
    });
  };
};
