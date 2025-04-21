import type { Root } from 'mdast';
import fs from 'node:fs/promises';
import path from 'node:path';

import { setupTempDir } from '../../../test-utils/setupTempDir';
import { parseMarkdownFile } from '../parseMarkdownFile';

const { tempDir } = setupTempDir();

async function createMarkdown(relativePath: string, content: string) {
  const fullPath = path.resolve(tempDir, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, 'utf-8');
  return fullPath;
}

describe('parseMarkdownFile', () => {
  it('parses a markdown file into an AST', async () => {
    const mdPath = await createMarkdown(
      'example.md',
      ['# Заголовок', '', 'Текст параграфа.'].join('\n'),
    );

    const tree = await parseMarkdownFile(mdPath);

    expect(tree).toBeDefined();
    expect(tree.type).toBe('root');
    expect((tree as Root).children.some((n) => n.type === 'heading')).toBe(
      true,
    );
    expect((tree as Root).children.some((n) => n.type === 'paragraph')).toBe(
      true,
    );
  });

  it('throws if file does not exist', async () => {
    const filePath = path.join(tempDir, 'missing.md');

    await expect(parseMarkdownFile(filePath)).rejects.toThrow(/ENOENT/);
  });
});
