import fs from 'node:fs';
import path from 'node:path';

/**
 * Creates a JSON file at the specified path with the given data.
 * If the directory does not exist, it will be created recursively.
 *
 * @param {string} filePath - The path where the JSON file should be created.
 * @param {unknown} data - The data to be written into the JSON file.
 * @param {boolean} [pretty=false] - Whether to format the JSON with indentation.
 * @returns {Promise<void>} A promise that resolves when the file is successfully written.
 */
export async function makeJsonFile(
  filePath: string,
  data: unknown,
  pretty: boolean = false,
): Promise<void> {
  const dirname = path.dirname(filePath);

  if (!fs.existsSync(dirname)) {
    await fs.promises.mkdir(dirname, { recursive: true });
  }

  const json = JSON.stringify(data, undefined, pretty ? 2 : undefined);

  await fs.promises.writeFile(filePath, json, { encoding: 'utf8' });
}
