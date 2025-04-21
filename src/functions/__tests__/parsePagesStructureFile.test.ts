import fs from 'node:fs/promises';
import path from 'node:path';
import { ZodError } from 'zod';

import { setupTempDir } from '../../../test-utils/setupTempDir';
import { parsePagesStructureFile } from '../parsePagesStructureFile';

const { tempDir } = setupTempDir();

async function createYaml(fileName: string, content: string) {
  const filePath = path.join(tempDir, fileName);
  await fs.writeFile(filePath, content);
  return filePath;
}

describe('parsePagesStructureFile function', () => {
  it('parses a valid structure.yml file', async () => {
    const filePath = await createYaml(
      'valid.yml',
      `
        pages:
          - id: "html.tags.div"
            route: "/html/div"
            ref: "./html/tags/div/page.yml"
          - id: "css.properties.background-color"
            route: "/css/background-color"
            ref: "./css/properties/background-color/page.yml"
      `,
    );

    const result = await parsePagesStructureFile(filePath);

    expect(result).toEqual({
      pages: [
        {
          id: 'html.tags.div',
          route: '/html/div',
          ref: './html/tags/div/page.yml',
        },
        {
          id: 'css.properties.background-color',
          route: '/css/background-color',
          ref: './css/properties/background-color/page.yml',
        },
      ],
    });
  });

  it('parses an empty pages array', async () => {
    const filePath = await createYaml('empty.yml', `pages: []`);
    const result = await parsePagesStructureFile(filePath);
    expect(result).toEqual({ pages: [] });
  });

  it('throws ZodError for missing "pages" key', async () => {
    const filePath = await createYaml('missing.yml', `notPages: []`);
    await expect(() => parsePagesStructureFile(filePath)).rejects.toThrow(
      ZodError,
    );
  });

  it('throws ZodError for invalid page item shape', async () => {
    const filePath = await createYaml(
      'invalid.yml',
      `
        pages:
          - id: 123
            route: true
            ref: null
      `,
    );

    await expect(() => parsePagesStructureFile(filePath)).rejects.toThrow(
      ZodError,
    );
  });

  it('throws if file does not exist', async () => {
    const filePath = path.join(tempDir, 'nonexistent.yml');
    await expect(() => parsePagesStructureFile(filePath)).rejects.toThrowError(
      /ENOENT/,
    );
  });
});
