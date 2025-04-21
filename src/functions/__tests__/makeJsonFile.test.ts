import fs from 'node:fs';
import path from 'node:path';

import { setupTempDir } from '../../../test-utils/setupTempDir';
import { makeJsonFile } from '../makeJsonFile';

const { tempDir } = setupTempDir();

const testFile = path.join(tempDir, 'test.json');

describe('makeJsonFile function', () => {
  it('creates a JSON file with correct content', async () => {
    const data = { foo: 'bar' };
    await makeJsonFile(testFile, data);

    const content = await fs.promises.readFile(testFile, 'utf8');
    expect(JSON.parse(content)).toEqual(data);
  });

  it('creates nested directories if needed', async () => {
    const nestedPath = path.join(tempDir, 'deep', 'nested', 'file.json');
    const data = { hello: 'world' };

    await makeJsonFile(nestedPath, data);

    const exists = fs.existsSync(nestedPath);
    expect(exists).toBe(true);

    const content = await fs.promises.readFile(nestedPath, 'utf8');
    expect(JSON.parse(content)).toEqual(data);
  });

  it('writes pretty-printed JSON when pretty = true', async () => {
    const data = { a: 1, b: { c: 2 } };
    await makeJsonFile(testFile, data, true);

    const content = await fs.promises.readFile(testFile, 'utf8');
    expect(content).toContain('\n  "a": 1,');
    expect(content).toContain('\n  "b": {');
  });

  it('overwrites existing file', async () => {
    await makeJsonFile(testFile, { old: true });
    await makeJsonFile(testFile, { new: true });

    const content = await fs.promises.readFile(testFile, 'utf8');
    expect(JSON.parse(content)).toEqual({ new: true });
  });
});
