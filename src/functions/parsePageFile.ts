import { parsePageData } from './parsePageData';
import { parseYamlFile } from './parseYamlFile';

/**
 * Reads, parses, and validates a page file in YAML format.
 *
 * This function:
 * 1. Reads the specified YAML file.
 * 2. Parses its content into a JavaScript object.
 * 3. Validates the parsed data against the expected schema.
 *
 * @param {string} filePath - The path to the YAML file containing page data.
 * @returns A promise resolving to the validated page data.
 *
 * **Example Usage:**
 * ```ts
 * const pageData = await parsePageFile("./css/properties/background-color/page.yml");
 * console.log(pageData);
 * ```
 *
 * **Throws:**
 * - `ZodError` if the parsed data does not match the expected schema.
 * - `Error` if the file cannot be read or parsed.
 */
export async function parsePageFile(filePath: string) {
  const fileData = await parseYamlFile(filePath); // Read and parse the YAML file
  return parsePageData(fileData); // Validate and return structured page data
}
