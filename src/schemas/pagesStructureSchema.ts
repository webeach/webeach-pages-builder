import { z } from 'zod';

import { ENTITY_ID_PATTERN } from '../constants/common';

import { pageRouteSchema } from './pageRouteSchema';

/**
 * Schema defining the structure of pages within the system.
 *
 * **Fields:**
 * - `pages`: An array of page objects, each containing:
 *   - `id`: A unique identifier for the page.
 *   - `parentId`: (Optional) The identifier of the parent page, if applicable.
 *   - `route`: The routing configuration for the page.
 *   - `ref`: The file path to the YML file containing the page's data.
 *
 * **Example:**
 * ```ts
 * {
 *   pages: [
 *     {
 *       id: "css.properties.background-color",
 *       route: "/css/background-color",
 *       ref: "./css/properties/background-color/page.yml"
 *     },
 *     {
 *       id: "css.properties.border-radius",
 *       parentId: "blog",
 *       route: { path: "/css/border-radius", aliases: ["/css/-webkit-border-radius"] },
 *       ref: "./css/properties/border-radius/page.yml"
 *     }
 *   ]
 * }
 * ```
 */
export const pagesStructureSchema = z.object({
  pages: z.array(
    z.object({
      /**
       * Unique identifier for the page.
       *
       * - Can contain English letters, numbers, `-`, and `.`
       * - `.` cannot appear at the beginning or end.
       *
       * **Example:**
       * ```ts
       * "html.div"
       * "css.background-color"
       * ```
       */
      id: z
        .string()
        .regex(ENTITY_ID_PATTERN)
        .describe(
          `Page identifier that may contain only English letters, the '-' and '.' characters. However, '.' cannot appear at the beginning or end.`,
        ),

      /**
       * (Optional) Parent page identifier.
       *
       * - Must follow the same format as `id`.
       * - Represents a hierarchical relationship.
       *
       * **Example:**
       * ```ts
       * "css"
       * "html"
       * ```
       */
      parentId: z
        .string()
        .regex(ENTITY_ID_PATTERN)
        .optional()
        .describe(
          `Parent page identifier that may contain only English letters, the '-' and '.' characters. However, '.' cannot appear at the beginning or end.`,
        ),

      /**
       * Routing configuration for the page.
       *
       * **Example:**
       * ```ts
       * "/html/div"
       * { path: "/css/border-radius", aliases: ["/css/-webkit-border-radius"] }
       * ```
       */
      route: pageRouteSchema,

      /**
       * File path to the YML file containing page data.
       *
       * **Example:**
       * ```ts
       * "./css/properties/background-color/page.yml"
       * "./css/properties/z-index/page.yml"
       * ```
       */
      ref: z.string().describe(`Path to the YML file containing page data.`),
    }),
  ),
});

/**
 * TypeScript type inferred from `pagesStructureSchema`.
 *
 * **Example:**
 * ```ts
 * const structure: PagesStructureSchemaType = {
 *   pages: [
 *     { id: "css.properties.background-color", route: "/css/background-color", ref: "./css/properties/background-color/page.yml" },
 *     { id: "css.properties.z-index", route: "/css/z-index", ref: "./css/properties/z-index/page.yml" }, *   ]
 * };
 * ```
 */
export type PagesStructureSchemaType = z.infer<typeof pagesStructureSchema>;
