import fs from 'node:fs/promises';
import path from 'node:path';

import { parseYamlFile } from '../parseYamlFile';

const tmpDir = path.resolve(__dirname, '__tmp__');

beforeEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

function createYamlFile(name: string, content: string) {
  const filePath = path.join(tmpDir, name);
  return fs.writeFile(filePath, content).then(() => filePath);
}

describe('parseYamlFile function', () => {
  it('parses a valid YAML file', async () => {
    const filePath = await createYamlFile('valid.yml', 'foo: bar\nbaz: 123');
    const result = await parseYamlFile(filePath);

    expect(result).toEqual({ foo: 'bar', baz: 123 });
  });

  it('returns null or undefined for empty file', async () => {
    const filePath = await createYamlFile('empty.yml', '');
    const result = await parseYamlFile(filePath);

    expect(result).toBeNull(); // или toBe(undefined) — в зависимости от реализации
  });

  it('parses nested YAML structures', async () => {
    const filePath = await createYamlFile(
      'nested.yml',
      `
        root:
          child:
            key: value
      `,
    );
    const result = await parseYamlFile(filePath);

    expect(result).toEqual({ root: { child: { key: 'value' } } });
  });
});
