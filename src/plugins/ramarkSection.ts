import { Root, RootContent, Section } from 'mdast';
import { Plugin } from 'unified';

/**
 * A Remark plugin that transforms flat Markdown structure into a nested section tree.
 *
 * Each heading with `depth > 1` starts a new `section`, and nested headings create
 * nested `section` nodes according to their depth.
 *
 * This is useful for building a semantic section tree from Markdown, reflecting
 * the visual hierarchy in a structured JSON format.
 *
 * Example Markdown:
 * ```md
 * # Title
 * ## Section 1
 * Content
 * ### Subsection 1.1
 * Content
 * ## Section 2
 * ```
 *
 * Resulting structure:
 * - Root contains heading `# Title`
 * - Followed by a section (depth 1) with heading `## Section 1`
 * - Inside it, nested section (depth 2) for `### Subsection 1.1`
 * - Then a sibling section (depth 1) for `## Section 2`
 */
export const remarkSection: Plugin<[], Root> = () => {
  return (tree) => {
    const newChildren: RootContent[] = [];
    const sectionStack: { node: any; depth: number }[] = [];

    const appendToCurrent = (child: RootContent) => {
      if (sectionStack.length > 0) {
        sectionStack[sectionStack.length - 1]!.node.children.push(child);
      } else {
        newChildren.push(child);
      }
    };

    for (const node of tree.children) {
      if (node.type === 'heading' && node.depth > 1) {
        while (
          sectionStack.length > 0 &&
          sectionStack[sectionStack.length - 1]!.depth >= node.depth
        ) {
          sectionStack.pop();
        }

        const section: Section = {
          type: 'section',
          depth: node.depth - 1,
          children: [node],
        };

        appendToCurrent(section);
        sectionStack.push({ node: section, depth: node.depth });
      } else {
        appendToCurrent(node);
      }
    }

    tree.children = newChildren;
  };
};
