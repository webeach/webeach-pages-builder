import { Root } from 'mdast';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { extractSingleCodeNode } from '../../../test-utils/extractSingleCodeNode';
import { remarkCodeMetaData } from '../remarkCodeMetaData';

describe('remarkCodeMetaData plugin', () => {
  async function run(markdown: string): Promise<Root> {
    const tree = unified().use(remarkParse).parse(markdown);
    return await unified().use(remarkCodeMetaData).run(tree);
  }

  it('parses meta string into metaData and removes meta', async () => {
    const markdown =
      '```ts widget="Example" active=true count=5\nconst x = 1;\n```';
    const tree = await run(markdown);
    const code = extractSingleCodeNode(tree);

    expect(code.meta).toBeNull();
    expect(code.metaData).toEqual({
      widget: 'Example',
      active: true,
      count: 5,
    });
  });

  it('does nothing if meta is not set', async () => {
    const markdown = '```ts\nconst x = 1;\n```';
    const tree = await run(markdown);
    const code = extractSingleCodeNode(tree);

    expect(code.meta).toBeNull();
    expect(code.metaData).toBeUndefined();
  });

  it('parses single quoted and boolean values', async () => {
    const markdown = `\`\`\`js title='My Function' visible=false\nconsole.log('ok');\n\`\`\``;
    const tree = await run(markdown);
    const code = extractSingleCodeNode(tree);

    expect(code.metaData).toEqual({
      title: 'My Function',
      visible: false,
    });
  });

  it('supports null and string values', async () => {
    const markdown =
      '```js ref=null description="This is a test"\nconsole.log();\n```';
    const tree = await run(markdown);
    const code = extractSingleCodeNode(tree);

    expect(code.metaData).toEqual({
      ref: null,
      description: 'This is a test',
    });
  });

  it('throws for invalid metadata', async () => {
    const markdown = '```js foo=123=456\nconsole.log();\n```';
    const tree = unified().use(remarkParse).parse(markdown);

    await expect(() =>
      unified().use(remarkCodeMetaData).run(tree),
    ).rejects.toThrow(/Invalid entry "foo=123=456"/);
  });
});
