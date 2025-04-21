import { parsePagesStructureData } from './parsePagesStructureData';
import { parseYamlFile } from './parseYamlFile';

/**
 * Reads, parses, and validates a YAML file containing the pages structure.
 *
 * This function:
 * 1. Reads the specified YAML file.
 * 2. Parses its content into a JavaScript object.
 * 3. Validates the parsed data against the expected pages structure schema.
 *
 * @param {string} path - The path to the YAML file containing the pages structure.
 * @returns A promise resolving to the validated pages structure data.
 *
 * **Example Usage:**
 * ```ts
 * const pagesStructure = await parsePagesStructureFile("./content/structure.yml");
 * console.log(pagesStructure);
 * ```
 *
 * **Throws:**
 * - `ZodError` if the parsed data does not match the expected schema.
 * - `Error` if the file cannot be read or parsed.
 */
export async function parsePagesStructureFile(path: string) {
  const fileData = await parseYamlFile(path); // Read and parse the YAML file
  return parsePagesStructureData(fileData); // Validate and return structured pages data
}
