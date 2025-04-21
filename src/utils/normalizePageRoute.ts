import { PageRouteSchemaType } from '../schemas/pageRouteSchema';

/**
 * Normalizes the given page route data into an object format.
 *
 * If the `routeData` is a simple string, it will be converted into an object with:
 * - `path` set to the string value.
 * - `aliases` set to an empty array.
 *
 * If `routeData` is already an object, it ensures that `aliases` is always defined.
 *
 * @param {PageRouteSchemaType} routeData - The route configuration to normalize.
 * @returns {Required<Exclude<PageRouteSchemaType, string>>} A normalized route object.
 *
 * **Example Usage:**
 * ```ts
 * normalizePageRoute("/css/background-color");
 * // Output: { path: "/css/background-color", aliases: [] }
 *
 * normalizePageRoute({ path: "/css/border-radius", aliases: ["/css/-webkit-border-radius", "/css/-moz-border-radius"] });
 * // Output: { path: "/css/border-radius", aliases: ["/css/-webkit-border-radius", "/css/-moz-border-radius"] }
 *
 * normalizePageRoute({ path: "/css/z-index" });
 * // Output: { path: "/css/z-index", aliases: [] }
 * ```
 */
export function normalizePageRoute(
  routeData: PageRouteSchemaType,
): Required<Exclude<PageRouteSchemaType, string>> {
  // If `routeData` is a string, convert it into an object with an empty aliases array.
  if (typeof routeData === 'string') {
    return {
      aliases: [],
      path: routeData,
    };
  }

  // Ensure `aliases` is always defined, defaulting to an empty array if not provided.
  return {
    ...routeData,
    aliases: routeData.aliases ?? [],
  };
}
