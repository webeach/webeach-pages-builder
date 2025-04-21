import { z, ZodTypeAny } from 'zod';

import { ALLOWED_LANGUAGES } from '../constants/common';

/**
 * Creates a schema for a localized value, where the keys are language codes and the values are of the specified type.
 *
 * - The keys must be one of the `ALLOWED_LANGUAGES` (e.g., `'ru'`).
 * - The values must match the provided Zod schema.
 *
 * @template Value - The Zod schema defining the type of values.
 * @param {Value} value - The base schema for the value.
 * @returns {ZodRecord<ZodEnum<typeof ALLOWED_LANGUAGES>, Value>} A Zod schema enforcing the language-based structure.
 *
 * **Example:**
 * ```ts
 * const localizedTitleSchema = valueWithLang(z.string());
 * type LocalizedTitle = z.infer<typeof localizedTitleSchema>;
 *
 * const validTitle: LocalizedTitle = { ru: "Привет" }; // ✅ Valid
 * ```
 */
export function valueWithLang<Value extends ZodTypeAny>(value: Value) {
  return z.record(z.enum(ALLOWED_LANGUAGES), value);
}
