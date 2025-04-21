import { Root, Widget } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Extracts the first `widget` node from the given Markdown AST.
 * Throws an error if no such node is found.
 *
 * @param tree Markdown AST root node.
 * @returns The extracted code node.
 */
export function extractSingleWidgetNode(tree: Root): Widget {
  let result: Widget | null = null;

  visit(tree, 'widget', (node) => {
    result = node;
  });

  if (!result) {
    throw new Error('No "widget" node found in the AST');
  }

  return result;
}
