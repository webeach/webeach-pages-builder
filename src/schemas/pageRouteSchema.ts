import { z } from 'zod';

// Regular expression pattern for a valid page route
const PAGE_ROUTE_PATTERN = /^\/([a-z0-9-]+)(?:\/[a-z0-9-]+)*$/;

/**
 * Zod schema for a valid browser route path.
 *
 * - Must start with `/`
 * - Can contain lowercase English letters and `-`
 * - Cannot end with `/`
 *
 * **Example:**
 * ```ts
 * "/html"
 * "/html/div"
 * "/css/background-color"
 * ```
 */
const routePathSchema = z
  .string()
  .regex(PAGE_ROUTE_PATTERN)
  .describe(
    `Browser route where the page will be accessible. Must start with '/', may contain lowercase English letters and the '-' character. Cannot end with '/'.`,
  );

/**
 * Zod schema for a page route configuration.
 *
 * A page route can be either:
 * 1. A simple string route.
 * 2. An object containing:
 *    - `path`: The main route (required).
 *    - `aliases`: Optional alternative routes that redirect to the main route.
 *
 * **Example:**
 * ```ts
 * "/css/border-radius"
 *
 * { path: "/css/border-radius", aliases: ["/css/-webkit-border-radius", "/css/-moz-border-radius"] }
 * ```
 */
export const pageRouteSchema = z.union([
  routePathSchema, // Direct route as a string
  z.object({
    path: routePathSchema, // Main route
    aliases: z
      .array(routePathSchema)
      .optional()
      .describe(`Alternative routes that will redirect to the main route.`),
  }),
]);

/**
 * TypeScript type inferred from `pageRouteSchema`.
 */
export type PageRouteSchemaType = z.infer<typeof pageRouteSchema>;
