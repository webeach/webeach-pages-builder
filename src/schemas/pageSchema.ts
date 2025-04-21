import { z } from 'zod';

import { valueWithLang } from './valueWithLang';

/**
 * Schema for metadata describing the page's status.
 *
 * - `deleted`: If `true`, the page is removed.
 * - `deprecated`: If `true`, the page is outdated.
 * - `experimental`: If `true`, the page is in an experimental state.
 * - `nonStandard`: If `true`, the page follows a non-standard format.
 *
 * **Example:**
 * ```ts
 * {
 *   deleted: true,
 *   deprecated: false,
 *   experimental: true,
 *   nonStandard: false
 * }
 * ```
 */
const pageMetaDataSchema = z.object({
  deleted: z.boolean().optional().describe(`Indicates if the page is deleted.`),
  deprecated: z
    .boolean()
    .optional()
    .describe(`Indicates if the page is deprecated.`),
  experimental: z
    .boolean()
    .optional()
    .describe(`Indicates if the page is experimental.`),
  nonStandard: z
    .boolean()
    .optional()
    .describe(`Indicates if the page follows a non-standard format.`),
});

/**
 * Schema for a page structure.
 *
 * **Fields:**
 * - `content`: The main content of the page, localized by language.
 * - `meta`: Optional metadata about the page's status.
 * - `properties`:
 *   - `description`: A localized description of the page.
 *   - `menuTitle`: (Optional) A localized title for menus.
 *   - `title`: A localized title of the page.
 *   - `tags`: (Optional) A localized array of tags associated with the page.
 *
 * **Example:**
 * ```ts
 * {
 *   content: { ru: "Это контент страницы" },
 *   meta: { deprecated: true },
 *   properties: {
 *     description: { ru: "Описание страницы" },
 *     menuTitle: { ru: "Меню" },
 *     title: { ru: "Заголовок страницы" },
 *     tags: { ru: ["тег1", "тег2"] }
 *   }
 * }
 * ```
 */
export const pageSchema = z.object({
  content: valueWithLang(z.string()).describe(`Localized page content.`),
  meta: pageMetaDataSchema
    .optional()
    .describe(`Optional metadata describing the page's status.`),
  properties: z.object({
    description: valueWithLang(z.string()).describe(
      `Localized description of the page.`,
    ),
    menuTitle: valueWithLang(z.string())
      .optional()
      .describe(`Localized menu title.`),
    title: valueWithLang(z.string()).describe(`Localized page title.`),
    tags: valueWithLang(z.array(z.string()))
      .optional()
      .describe(`Localized tags for the page.`),
  }),
});

/**
 * TypeScript type inferred from `pageSchema`.
 *
 * **Example:**
 * ```ts
 * const pageData: PageSchemaType = {
 *   content: { ru: "Текст страницы" },
 *   meta: { experimental: true },
 *   properties: {
 *     description: { ru: "Описание" },
 *     title: { ru: "Заголовок" },
 *   }
 * };
 * ```
 */
export type PageSchemaType = z.infer<typeof pageSchema>;
