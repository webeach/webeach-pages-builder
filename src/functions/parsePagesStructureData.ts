import { pagesStructureSchema } from '../schemas/pagesStructureSchema';

/**
 * Parses and validates the provided pages structure data using Zod.
 *
 * This function ensures that the input data conforms to the `pagesStructureSchema`.
 * If the data is invalid, a `ZodError` will be thrown.
 *
 * @param {unknown} inputData - The raw input data to be validated.
 * @returns The parsed and validated pages structure data.
 *
 * **Example Usage:**
 * ```ts
 * const validData = {
 *   pages: [
 *     { id: "html.tags.div", route: "/html/div", ref: "./html/tags/div/page.yml" },
 *     { id: "css.properties.background-color", route: "/css/background-color", ref: "./css/properties/background-color/page.yml" }
 *   ]
 * };
 *
 * const parsedData = parsePagesStructureData(validData);
 * console.log(parsedData); // ✅ Successfully validated structure
 * ```
 *
 * **Throws:**
 * - `ZodError` if `inputData` does not match the expected schema.
 */
export function parsePagesStructureData(inputData: unknown) {
  return pagesStructureSchema.parse(inputData);
}
