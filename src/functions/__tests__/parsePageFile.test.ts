import fs from 'node:fs/promises';
import path from 'node:path';
import { ZodError } from 'zod';

import { setupTempDir } from '../../../test-utils/setupTempDir';
import { parsePageFile } from '../parsePageFile';

const { tempDir } = setupTempDir();

async function createYaml(fileName: string, content: string) {
  const filePath = path.join(tempDir, fileName);
  await fs.writeFile(filePath, content);
  return filePath;
}

describe('parsePageFile function', () => {
  it('parses a valid page.yml file', async () => {
    const filePath = await createYaml(
      'valid.yml',
      `
        content:
          ru: "Цвет фона задается свойством background-color."
        properties:
          title:
            ru: "background-color"
          description:
            ru: "CSS-свойство background-color определяет цвет фона элемента."
          tags:
            ru:
              - css
              - background
              - color
      `,
    );

    const result = await parsePageFile(filePath);

    expect(result).toEqual({
      content: {
        ru: 'Цвет фона задается свойством background-color.',
      },
      properties: {
        title: {
          ru: 'background-color',
        },
        description: {
          ru: 'CSS-свойство background-color определяет цвет фона элемента.',
        },
        tags: {
          ru: ['css', 'background', 'color'],
        },
      },
    });
  });

  it('throws ZodError for invalid schema (missing properties)', async () => {
    const filePath = await createYaml(
      'invalid.yml',
      `
        content:
          ru: "Missing properties section"
      `,
    );

    await expect(() => parsePageFile(filePath)).rejects.toThrow(ZodError);
  });

  it('throws ZodError for empty YAML', async () => {
    const filePath = await createYaml('empty.yml', ``);

    await expect(() => parsePageFile(filePath)).rejects.toThrow(ZodError);
  });

  it('throws if file does not exist', async () => {
    const filePath = path.join(tempDir, 'nonexistent.yml');

    await expect(() => parsePageFile(filePath)).rejects.toThrowError(/ENOENT/);
  });
});
