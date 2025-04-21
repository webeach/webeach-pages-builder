import fs from 'node:fs/promises';
import path from 'node:path';

import { setupTempDir } from '../../../test-utils/setupTempDir';
import { PageSchemaType } from '../../schemas/pageSchema';
import {
  OutputPagesStructure,
  OutputPagesStructureLinkedItem,
} from '../../types/common';
import { buildAllPages } from '../buildAllPages';

const { tempDir } = setupTempDir();

async function createFile(relativePath: string, content: string) {
  const fullPath = path.resolve(tempDir, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content);
  return fullPath;
}

async function readJson<T>(relativePath: string): Promise<T> {
  const fullPath = path.resolve(tempDir, relativePath);
  const content = await fs.readFile(fullPath, 'utf-8');
  return JSON.parse(content);
}

describe('buildAllPages', () => {
  it('builds all pages and generates structure.json', async () => {
    // Step 1: Prepare content
    await createFile(
      'content/structure.yml',
      [
        'pages:',
        '  - id: "css.properties.background-color"',
        '    route:',
        '      path: "/css/background-color"',
        '      aliases:',
        '        - "/css/bg"',
        '    ref: "./css/background-color/page.yml"',
      ].join('\n'),
    );

    await createFile(
      'content/css/background-color/page.yml',
      [
        'content:',
        '  ru: ./ru.md',
        '  en: ./en.md',
        'properties:',
        '  title:',
        '    ru: "Фон"',
        '    en: "Background"',
        '  description:',
        '    ru: "Цвет фона"',
        '    en: "Background color"',
        'meta:',
        '  deleted: false',
      ].join('\n'),
    );

    await createFile('content/css/background-color/ru.md', '# ru заголовок');
    await createFile('content/css/background-color/en.md', '# en title');

    // Step 2: Build
    await buildAllPages(
      path.resolve(tempDir, 'content/structure.yml'),
      tempDir,
      false,
    );

    // Step 3: Validate output
    const structure = await readJson<{ pages: OutputPagesStructure }>(
      'structure.json',
    );
    expect(structure.pages).toHaveLength(2); // main + alias

    const main = structure.pages.find(
      (p) => p.route === '/css/background-color',
    )!;
    const alias = structure.pages.find(
      (p) => p.route === '/css/bg',
    ) as OutputPagesStructureLinkedItem;

    expect(main.uuid).toBeDefined();
    expect(alias.linkedUuid).toBe(main.uuid);

    const ruJson = await readJson<PageSchemaType>(`pages/${main.uuid}/ru.json`);
    const enJson = await readJson<PageSchemaType>(`pages/${main.uuid}/en.json`);

    expect(ruJson.properties.title).toBe('Фон');
    expect(enJson.properties.title).toBe('Background');
    expect(ruJson.meta!.deleted).toBe(false);
  });

  it('builds multiple pages defined in structure.yml', async () => {
    await createFile(
      'content/structure.yml',
      [
        'pages:',
        '  - id: "html.tags.div"',
        '    route: "/html/div"',
        '    ref: "./html/div/page.yml"',
        '  - id: "css.properties.color"',
        '    route: "/css/color"',
        '    ref: "./css/color/page.yml"',
      ].join('\n'),
    );

    // Page 1: html.tags.div
    await createFile(
      'content/html/div/page.yml',
      [
        'content:',
        '  ru: ./div.ru.md',
        '  en: ./div.en.md',
        'properties:',
        '  title:',
        '    ru: "div"',
        '    en: "<div>"',
        '  description:',
        '    ru: "Контейнер"',
        '    en: "Container element"',
      ].join('\n'),
    );

    await createFile('content/html/div/div.ru.md', '# div (RU)');
    await createFile('content/html/div/div.en.md', '# div (EN)');

    // Page 2: css.properties.color
    await createFile(
      'content/css/color/page.yml',
      [
        'content:',
        '  ru: ./ru.md',
        '  en: ./en.md',
        'properties:',
        '  title:',
        '    ru: "Цвет"',
        '    en: "Color"',
        '  description:',
        '    ru: "CSS свойство color"',
        '    en: "The color property"',
      ].join('\n'),
    );

    await createFile('content/css/color/ru.md', '# цвет');
    await createFile('content/css/color/en.md', '# color');

    // Build all pages
    await buildAllPages(
      path.resolve(tempDir, 'content/structure.yml'),
      tempDir,
      false,
    );

    // Validate structure.json
    const { pages } = await readJson<{ pages: OutputPagesStructure }>(
      'structure.json',
    );

    expect(pages).toHaveLength(2);

    const div = pages.find((p) => p.id === 'html.tags.div')!;
    const color = pages.find((p) => p.id === 'css.properties.color')!;

    expect(div.route).toBe('/html/div');
    expect(color.route).toBe('/css/color');
    expect(div.uuid).not.toBe(color.uuid); // UUIDs must be unique

    // Validate generated page files
    const divRu = await readJson<PageSchemaType>(`pages/${div.uuid}/ru.json`);
    const colorEn = await readJson<PageSchemaType>(
      `pages/${color.uuid}/en.json`,
    );

    expect(divRu.properties.title).toBe('div');
    expect(colorEn.properties.title).toBe('Color');
  });
});
