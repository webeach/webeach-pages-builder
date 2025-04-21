import fs from 'node:fs/promises';
import path from 'node:path';

import { setupTempDir } from '../../../test-utils/setupTempDir';
import { PageSchemaType } from '../../schemas/pageSchema';
import { OutputPagesStructureItem } from '../../types/common';
import { buildPage } from '../buildPage';

const { tempDir } = setupTempDir();

const uuid = 'test-uuid';

async function createFile(relativePath: string, content: string) {
  const fullPath = path.resolve(tempDir, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content);
  return fullPath;
}

async function readJson<T>(relativePath: string): Promise<T> {
  const json = await fs.readFile(path.join(tempDir, relativePath), 'utf-8');
  return JSON.parse(json);
}

describe('buildPage function', () => {
  it('builds language-specific JSON files correctly', async () => {
    const markdownRuPath = 'css/background-color/index.ru.md';
    const markdownEnPath = 'css/background-color/index.en.md';
    const yamlPath = 'css/background-color/page.yml';

    await createFile(markdownRuPath, `## ru title\n\nОписание для ru`);
    await createFile(markdownEnPath, `## en title\n\nDescription for en`);

    await createFile(
      yamlPath,
      [
        'content:',
        '  ru: ./index.ru.md',
        '  en: ./index.en.md',
        'properties:',
        '  title:',
        '    ru: "Заголовок RU"',
        '    en: "Title EN"',
        '  description:',
        '    ru: "Описание RU"',
        '    en: "Description EN"',
        'meta:',
        '  deprecated: true',
      ].join('\n'),
    );

    const pageItem: OutputPagesStructureItem = {
      id: 'css.properties.background-color',
      route: '/css/background-color',
      uuid,
    };

    await buildPage(pageItem, path.join(tempDir, yamlPath), tempDir, false);

    const ruJson = await readJson<PageSchemaType>(`pages/${uuid}/ru.json`);
    const enJson = await readJson<PageSchemaType>(`pages/${uuid}/en.json`);

    expect(ruJson.meta).toEqual({ deprecated: true });
    expect(ruJson.properties.title).toBe('Заголовок RU');
    expect(ruJson.properties.description).toBe('Описание RU');
    expect(ruJson.content).toEqual(expect.any(Object));

    expect(enJson.meta).toEqual({ deprecated: true });
    expect(enJson.properties.title).toBe('Title EN');
    expect(enJson.properties.description).toBe('Description EN');
    expect(enJson.content).toEqual(expect.any(Object));
  });
});
