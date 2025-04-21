import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { extractSingleCodeNode } from '../../../test-utils/extractSingleCodeNode';
import { remarkCodeToHtml } from '../ramarkCodeToHtml';

describe('remarkCodeToHtml plugin', () => {
  it('adds valueHtml and clears value for a valid code block', async () => {
    const markdown = '```ts\nconst a = 1;\n```';

    const tree = unified()
      .use(remarkParse)
      .use(remarkCodeToHtml)
      .parse(markdown);

    const transformed = await unified().use(remarkCodeToHtml).run(tree);

    const code = extractSingleCodeNode(transformed);

    expect(code.lang).toBe('ts');
    expect(code.value).toBe('');
    expect(code.valueHtml).toContain('_token-keyword');
    expect(code.valueHtml).toContain('const');
  });

  it('does not throw on unsupported lang and logs a warning', async () => {
    const markdown = '```unsupportedlang\nx = y\n```';

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const tree = unified()
      .use(remarkParse)
      .use(remarkCodeToHtml)
      .parse(markdown);

    const transformed = await unified().use(remarkCodeToHtml).run(tree);

    const code = extractSingleCodeNode(transformed);

    expect(code.lang).toBe('unsupportedlang');
    expect(code.value).not.toBe(''); // value wasn't cleared
    expect(code.valueHtml).toBeUndefined(); // no rendered HTML

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Unknown language: "unsupportedlang" is not registered',
    );

    consoleWarnSpy.mockRestore();
  });

  it('leaves other node types untouched', async () => {
    const markdown = '# Heading\n\nSome text\n\n```js\nconsole.log("hi")\n```';

    const tree = unified()
      .use(remarkParse)
      .use(remarkCodeToHtml)
      .parse(markdown);

    const transformed = await unified().use(remarkCodeToHtml).run(tree);

    let nonCodeVisited = false;
    visit(transformed, (node) => {
      if (node.type !== 'code' && node.type !== 'root') {
        nonCodeVisited = true;
      }
    });

    expect(nonCodeVisited).toBe(true);

    const code = extractSingleCodeNode(transformed);
    expect(code.valueHtml).toContain('_token-string');
    expect(code.value).toBe('');
  });
});
