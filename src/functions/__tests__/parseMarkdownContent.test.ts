import {
  Code,
  Heading,
  Root,
  RootContent,
  Section,
  Table,
  Widget,
} from 'mdast';

import { parseMarkdownContent } from '../parseMarkdownContent';

function extractNodesByType(tree: Root, type: string): RootContent[] {
  const result: RootContent[] = [];

  const walk = (node: any) => {
    if (node.type === type) {
      result.push(node);
    }

    if (node.children) {
      node.children.forEach(walk);
    }
  };

  walk(tree);

  return result;
}

describe('parseMarkdownContent function', () => {
  it('parses basic sections and headings', async () => {
    const md = ['# Title', '', '## Section', '', 'Content'].join('\n');
    const tree = await parseMarkdownContent(md);

    const headings = extractNodesByType(tree, 'heading') as Heading[];
    const sections = extractNodesByType(tree, 'section') as Section[];

    expect(headings).toHaveLength(2);
    expect(sections).toHaveLength(1);
    expect(sections[0]!.depth).toBe(1);
  });

  it('parses widget block and transforms to widget node', async () => {
    const md = [
      '```yaml widget="CodeWidget"',
      'title: Hello',
      'description: Sample',
      '```',
    ].join('\n');

    const tree = await parseMarkdownContent(md);
    const widgets = extractNodesByType(tree, 'widget') as Widget[];

    expect(widgets).toHaveLength(1);
    expect(widgets[0]!.name).toBe('CodeWidget');
    expect(widgets[0]!.data).toEqual({
      title: 'Hello',
      description: 'Sample',
    });
  });

  it('parses GFM features (like table)', async () => {
    const md = ['| A | B |', '|---|---|', '| 1 | 2 |'].join('\n');
    const tree = await parseMarkdownContent(md);

    const tables = extractNodesByType(tree, 'table') as Table[];
    expect(tables).toHaveLength(1);
    expect(tables[0]!.type).toBe('table');
  });

  it('parses widget YAML block correctly', async () => {
    const md = [
      '```yaml widget="TestWidget"',
      'title: Hello',
      'description: Sample desc',
      '```',
    ].join('\n');

    const tree = await parseMarkdownContent(md);
    const widgets = extractNodesByType(tree, 'widget') as Widget[];

    expect(widgets[0]).toBeDefined();
    expect(widgets[0]!.name).toBe('TestWidget');
    expect(widgets[0]!.data).toEqual({
      title: 'Hello',
      description: 'Sample desc',
    });
  });

  it('parses code block and adds valueHtml', async () => {
    const md = ['```ts', 'const a = 1;', '```'].join('\n');
    const tree = await parseMarkdownContent(md);
    const codes = extractNodesByType(tree, 'code') as Code[];

    expect(codes[0]!.value).toBe('');
    expect(codes[0]!.valueHtml).toMatch(/const/);
  });
});
