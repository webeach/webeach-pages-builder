import { Root } from 'mdast';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import { parseMarkdownCodeMetaData } from '../functions/parseMarkdownCodeMetaData';

/**
 * A Remark plugin that extracts metadata from code blocks in Markdown.
 *
 * This plugin processes `code` nodes with a `meta` field, parsing the metadata
 * into a structured format and storing it in `metaData`. The original `meta`
 * field is then set to `null`.
 *
 * @returns A Remark plugin that transforms `code` nodes.
 */
export const remarkCodeMetaData: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      // If the `code` node has metadata, parse it and store it in `metaData`
      if (node.meta) {
        node.metaData = parseMarkdownCodeMetaData(node.meta);
        node.meta = null; // Clear the original `meta` field to avoid duplication
      }
    });
  };
};
