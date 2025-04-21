import path from 'node:path';
import { v5 as uuidV5 } from 'uuid';

import { ProgressLogger } from '../modules/ProgressLogger';
import {
  OutputPagesStructure,
  OutputPagesStructureItem,
} from '../types/common';
import { normalizePageRoute } from '../utils/normalizePageRoute';

import { buildPage } from './buildPage';
import { makeJsonFile } from './makeJsonFile';
import { parsePagesStructureFile } from './parsePagesStructureFile';

// Filename for the generated structure file
const STRUCTURE_FILENAME = 'structure';

/**
 * Generates a unique UUID for a page based on its ID and route.
 *
 * @param {string} id - The unique identifier of the page.
 * @param {string} route - The primary route of the page.
 * @returns {string} A UUID generated using the v5 algorithm.
 *
 * **Example:**
 * ```ts
 * const uuid = generatePageUuid("css.properties.background-color", "/css/background-color");
 * console.log(uuid);
 * ```
 */
function generatePageUuid(id: string, route: string): string {
  return uuidV5([route, id].join('$v1$'), uuidV5.URL);
}

/**
 * Builds all pages from a structured page definition file.
 *
 * This function:
 * 1. Reads and parses the YAML file containing the pages structure.
 * 2. Normalizes all route entries (ensuring `aliases` are always present).
 * 3. Generates a unique UUID for each page and each alias.
 * 4. Builds each individual page into language-specific JSON files.
 * 5. Generates a final `structure.json` mapping all routes to UUIDs.
 *
 * @param {string} pagesStructurePath - Path to the YAML file containing the pages structure.
 * @param {string} outputDir - Directory where the generated JSON files will be saved.
 * @param {boolean} minify - Whether to output minified (single-line) JSON files. If `false`, output will be pretty-printed.
 *
 * **Example Usage:**
 * ```ts
 * await buildAllPages("./content/structure.yml", "./dist", true);
 * ```
 *
 * **Generated Files:**
 * - `dist/pages/{uuid}/ru.json`
 * - `dist/pages/{uuid}/en.json`
 * - `dist/structure.json` — list of all routes with corresponding UUIDs
 */

export async function buildAllPages(
  pagesStructurePath: string,
  outputDir: string,
  minify: boolean,
) {
  // Parse the pages structure from the YAML file
  const pagesStructureData = await parsePagesStructureFile(pagesStructurePath);
  const pagesStructureDirname = path.dirname(pagesStructurePath);

  // Initialize the output structure array
  const outputPagesStructure: OutputPagesStructure = [];

  const progressLogger = new ProgressLogger({
    textHandler: ({ counter, percentage, total }) => {
      return `Progress: ${percentage}% [${counter}/${total} files]`;
    },
    total: pagesStructureData.pages.length,
  });

  // Process each page in the structure
  for (const pageStructureItem of pagesStructureData.pages) {
    // Normalize the page route to ensure consistency
    const normalizedRoute = normalizePageRoute(pageStructureItem.route);

    const pagePath = path.resolve(pagesStructureDirname, pageStructureItem.ref);

    // Generate a UUID for the main page route
    const pageUuid = generatePageUuid(
      pageStructureItem.id,
      normalizedRoute.path,
    );

    // Create an output structure item for the main route
    const outputStructureItem: OutputPagesStructureItem = {
      id: pageStructureItem.id,
      route: normalizedRoute.path,
      uuid: pageUuid,
    };

    // Store the main route structure
    outputPagesStructure.push(outputStructureItem);

    // Generate alias routes and link them to the main page UUID
    for (const aliasRouteItem of normalizedRoute.aliases) {
      outputPagesStructure.push({
        id: pageStructureItem.id,
        route: aliasRouteItem,
        linkedUuid: pageUuid,
        uuid: generatePageUuid(pageStructureItem.id, aliasRouteItem),
      });
    }

    // Build the page and generate language-specific JSON files
    await buildPage(outputStructureItem, pagePath, outputDir, minify);

    progressLogger.counter++;
    progressLogger.log(
      `Building page [${progressLogger.counter}]: ${path.relative(process.cwd(), pagePath)}`,
      'green',
    );
  }

  // Define the output file path for the structure JSON
  const structureFilePath = path.resolve(
    outputDir,
    `${STRUCTURE_FILENAME}.json`,
  );

  // Save the generated pages structure to a JSON file
  await makeJsonFile(structureFilePath, {
    pages: outputPagesStructure,
  });
}
