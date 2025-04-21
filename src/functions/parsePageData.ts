import { pageSchema } from '../schemas/pageSchema';

/**
 * Parses and validates the provided page data using Zod.
 *
 * This function ensures that the input data conforms to the `pageSchema`.
 * If the data is invalid, a `ZodError` will be thrown.
 *
 * @param {unknown} inputData - The raw input data to be validated.
 * @returns The parsed and validated page data.
 *
 * **Example Usage:**
 * ```ts
 * const validPageData = {
 *   content: { ru: "Цвет фона задается свойством background-color." },
 *   properties: {
 *     description: { ru: "CSS-свойство background-color определяет цвет фона элемента." },
 *     title: { ru: "background-color" },
 *     tags: { ru: ["css", "background", "color"] }
 *   }
 * };
 *
 * const parsedData = parsePageData(validPageData);
 * console.log(parsedData); // ✅ Successfully validated structure
 * ```
 *
 * **Throws:**
 * - `ZodError` if `inputData` does not match the expected schema.
 */
export function parsePageData(inputData: unknown) {
  return pageSchema.parse(inputData);
}
