/**
 * Represents the structure of output pages, which can be either:
 * - A standard page (`OutputPagesStructureItem`).
 * - A linked page (`OutputPagesStructureLinkedItem`).
 */
export type OutputPagesStructure = Array<
  OutputPagesStructureItem | OutputPagesStructureLinkedItem
>;

/**
 * Defines the structure of a standard output page.
 *
 * **Fields:**
 * - `id` - The unique identifier of the page.
 * - `route` - The browser route where the page will be accessible.
 * - `uuid` - A unique universal identifier for the page.
 *
 * **Example:**
 * ```ts
 * {
 *   id: "css.properties.background-color",
 *   route: "/css/background-color",
 *   uuid: "123e4567-e89b-12d3-a456-426614174000"
 * }
 * ```
 */
export interface OutputPagesStructureItem {
  id: string;
  route: string;
  uuid: string;
}

/**
 * Defines the structure of a linked output page.
 *
 * A linked page is similar to a standard page but has an additional `linkedUuid` field
 * that references another page.
 *
 * **Fields:**
 * - `id` - The unique identifier of the linked page.
 * - `route` - The browser route where the linked page will be accessible.
 * - `uuid` - A unique universal identifier for the linked page.
 * - `linkedUuid` - A reference to another page’s `uuid`.
 *
 * **Example:**
 * ```ts
 * {
 *   id: "css.properties.border-radius",
 *   route: "/css/border-radius",
 *   uuid: "456e7890-e89b-12d3-a456-426614174001",
 *   linkedUuid: "123e4567-e89b-12d3-a456-426614174000"
 * }
 * ```
 */
export interface OutputPagesStructureLinkedItem
  extends OutputPagesStructureItem {
  linkedUuid: string;
}
