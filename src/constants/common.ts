/**
 * List of allowed languages for localized content.
 *
 * **Example:**
 * ```ts
 * const language: typeof ALLOWED_LANGUAGES[number] = 'ru'; // ✅ Valid
 * ```
 */
export const ALLOWED_LANGUAGES = ['en', 'ru'] as const;

/**
 * Regular expression pattern for a valid entity ID.
 *
 * - Can contain letters, numbers, underscores (`_`), and hyphens (`-`).
 * - Can have dot-separated segments (e.g., `section.sub-section`).
 * - Cannot start or end with a dot (`.`).
 *
 * **Valid Examples:**
 * ```ts
 * "page-1"
 * "article_42"
 * "docs.section1"
 * "product-category.sub-category"
 * ```
 *
 * **Invalid Examples:**
 * ```ts
 * ".invalid-start"
 * "invalid-end."
 * "double..dots"
 * ```
 */
export const ENTITY_ID_PATTERN = /^[\w-]+(?:\.[\w-]+)*$/;
