import { Root } from 'mdast';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { parse } from 'yaml';

/**
 * A Remark plugin that transforms YAML code blocks into widget nodes.
 *
 * This plugin processes `code` nodes where:
 * - The language is `yaml`.
 * - The `metaData` contains a `widget` field.
 *
 * When these conditions are met, the YAML content is parsed and the node
 * is transformed into a `widget` node with structured `data`.
 *
 * @returns A Remark plugin that modifies `code` nodes.
 */
export const remarkWidget: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      // Check if the node is a YAML code block with `widget` metadata
      if (node.lang === 'yaml' && node.metaData && node.metaData.widget) {
        const widgetData = parse(node.value); // Parse the YAML content

        // Transform the node into a widget node
        Object.assign(node, {
          data: widgetData, // Store parsed YAML data
          lang: undefined, // Remove the language definition
          name: node.metaData.widget, // Set the widget name
          metaData: undefined, // Remove metadata after processing
          type: 'widget', // Change node type to `widget`
          value: undefined, // Remove raw YAML content
        });
      }
    });
  };
};
