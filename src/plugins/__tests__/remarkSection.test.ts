import { Root, Section } from 'mdast';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { remarkSection } from '../ramarkSection';

async function run(markdown: string): Promise<Root> {
  const parser = unified().use(remarkParse).use(remarkSection);
  const tree = parser.parse(markdown);
  return await parser.run(tree);
}

describe('remarkSection', () => {
  it('wraps nested headings into hierarchical sections', async () => {
    const markdown = [
      '# Page title',
      '',
      '## First',
      '',
      'Paragraph',
      '',
      '### Sub',
      '',
      'Text',
      '',
      '## Second',
      '',
      'Another paragraph',
    ].join('\n');

    const root = await run(markdown);

    expect(root.children).toHaveLength(3);
    expect(root.children[0]!.type).toBe('heading'); // # Page title

    const sectionFirst = root.children[1] as Section;
    expect(sectionFirst.type).toBe('section');
    expect(sectionFirst.depth).toBe(1);
    expect(sectionFirst.children[0]!.type).toBe('heading'); // ## First
    expect(sectionFirst.children[1]!.type).toBe('paragraph');

    const subSection = sectionFirst.children[2] as Section;
    expect(subSection.type).toBe('section');
    expect(subSection.depth).toBe(2);
    expect((subSection.children[0] as Section).depth).toBe(3); // ### Sub
    expect(subSection.children[1]!.type).toBe('paragraph');

    const sectionSecond = root.children[2] as Section;
    expect(sectionSecond.type).toBe('section');
    expect(sectionSecond.depth).toBe(1);
    expect((sectionSecond.children[0] as Section).depth).toBe(2); // ## Second
    expect(sectionSecond.children[1]!.type).toBe('paragraph');
  });

  it('does not wrap # headings into sections', async () => {
    const markdown = ['# Top', '', '## Sub', '', 'Text'].join('\n');

    const root = await run(markdown);

    expect(root.children[0]!.type).toBe('heading'); // # Top
    expect(root.children[1]!.type).toBe('section'); // ## Sub
  });

  it('wraps content under nearest heading section', async () => {
    const markdown = ['## Title', '', 'Text 1', '', 'Text 2'].join('\n');

    const root = await run(markdown);
    const section = root.children[0] as Section;

    expect(section.type).toBe('section');
    expect(section.depth).toBe(1);
    expect(section.children).toHaveLength(3);
    expect(section.children[0]!.type).toBe('heading');
    expect(section.children[1]!.type).toBe('paragraph');
    expect(section.children[2]!.type).toBe('paragraph');
  });

  it('creates deeply nested section tree by heading level', async () => {
    const markdown = ['## A', '### B', '#### C', '##### D'].join('\n');

    const root = await run(markdown);

    const a = root.children[0] as Section;
    expect(a.type).toBe('section');
    expect(a.depth).toBe(1);

    const b = a.children[1] as Section;
    expect(b.type).toBe('section');
    expect(b.depth).toBe(2);

    const c = b.children[1] as Section;
    expect(c.type).toBe('section');
    expect(c.depth).toBe(3);

    const d = c.children[1] as Section;
    expect(d.type).toBe('section');
    expect(d.depth).toBe(4);
  });

  it('returns flat tree if there are no headings', async () => {
    const markdown = ['Hello world', '', 'Another paragraph.'].join('\n');

    const root = await run(markdown);

    expect(root.children).toHaveLength(2);
    expect(root.children.every((c) => c.type === 'paragraph')).toBe(true);
  });
});
