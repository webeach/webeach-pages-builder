import { Root } from 'mdast';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { extractSingleCodeNode } from '../../../test-utils/extractSingleCodeNode';
import { extractSingleWidgetNode } from '../../../test-utils/extractSingleWidgetNode';
import { remarkCodeMetaData } from '../remarkCodeMetaData';
import { remarkWidget } from '../remarkWidget';

async function run(markdown: string): Promise<Root> {
  const parser = unified()
    .use(remarkParse)
    .use(remarkCodeMetaData)
    .use(remarkWidget);
  const tree = parser.parse(markdown);
  return await parser.run(tree);
}

describe('remarkWidget plugin', () => {
  it('transforms code block into widget node when widget is defined in meta', async () => {
    const markdown = [
      '```yaml widget="TestWidget"',
      'title: Hello',
      'description: "This is a test widget"',
      '```',
    ].join('\n');

    const tree = await run(markdown);
    const widget = extractSingleWidgetNode(tree);

    expect(widget.type).toBe('widget');
    expect(widget.name).toBe('TestWidget');
    expect(widget.data).toEqual({
      title: 'Hello',
      description: 'This is a test widget',
    });
  });

  it('supports nested YAML in widget', async () => {
    const markdown = [
      '```yaml widget="NestedWidget"',
      'section:',
      '  title: Hello',
      '  items:',
      '    - name: A',
      '    - name: B',
      '```',
    ].join('\n');

    const tree = await run(markdown);
    const widget = extractSingleWidgetNode(tree);

    expect(widget.name).toBe('NestedWidget');
    expect(widget.data).toEqual({
      section: {
        title: 'Hello',
        items: [{ name: 'A' }, { name: 'B' }],
      },
    });
  });

  it('leaves code block untouched if no widget meta is present', async () => {
    const markdown = ['```yaml title="Not a widget"', 'foo: bar', '```'].join(
      '\n',
    );

    const tree = await run(markdown);

    // extractSingleWidgetNode должен выбросить ошибку
    expect(() => extractSingleWidgetNode(tree)).toThrow(
      'No "widget" node found in the AST',
    );

    const code = extractSingleCodeNode(tree);
    expect(code.lang).toBe('yaml');
    expect(code.metaData?.title).toBe('Not a widget');
    expect(code.value).toContain('foo: bar');
  });

  it('ignores code blocks with unsupported language', async () => {
    const markdown = [
      '```js widget="IgnoredWidget"',
      'console.log("hi");',
      '```',
    ].join('\n');

    const tree = await run(markdown);

    expect(() => extractSingleWidgetNode(tree)).toThrow(
      'No "widget" node found in the AST',
    );

    const code = extractSingleCodeNode(tree);
    expect(code.lang).toBe('js');
    expect(code.metaData?.widget).toBe('IgnoredWidget');
  });
});
