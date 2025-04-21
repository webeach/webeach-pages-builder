import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export function setupTempDir() {
  const tempDir = path.resolve(process.cwd(), `__temp-${randomUUID()}__`);

  beforeAll(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  return { tempDir };
}
