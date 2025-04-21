import fs from 'node:fs';
import { parse } from 'yaml';

/**
 * Reads and parses a YAML file, allowing type inference for the result.
 *
 * @template ResultData - The expected type of the parsed YAML content.
 * @param {string} path - The path to the YAML file.
 * @returns {Promise<ResultData>} A promise that resolves with the parsed YAML content.
 */
export async function parseYamlFile<ResultData = any>(
  path: string,
): Promise<ResultData> {
  // Read the YAML file as a Buffer
  const fileContent = await fs.promises.readFile(path);

  // Convert the Buffer to a string and parse it as YAML
  return parse(fileContent.toString());
}
