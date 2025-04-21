import { Code, Root } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Extracts the first `code` node from the given Markdown AST.
 * Throws an error if no such node is found.
 *
 * @param tree Markdown AST root node.
 * @returns The extracted code node.
 */
export function extractSingleCodeNode(tree: Root): Code {
  let result: Code | null = null;

  visit(tree, 'code', (node) => {
    result = node;
  });

  if (!result) {
    throw new Error('No "code" node found in the AST');
  }

  return result;
}
