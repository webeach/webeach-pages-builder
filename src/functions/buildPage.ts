import path from 'node:path';

import { ALLOWED_LANGUAGES } from '../constants/common';
import { OutputPagesStructureItem } from '../types/common';

import { makeJsonFile } from './makeJsonFile';
import { parseMarkdownFile } from './parseMarkdownFile';
import { parsePageFile } from './parsePageFile';

// Set for quick lookup of allowed languages
const ALLOWED_LANGUAGES_SET = new Set(ALLOWED_LANGUAGES);

// Directory where page JSON files will be stored
const PAGE_DIRNAME = 'pages';

type LangKey = (typeof ALLOWED_LANGUAGES)[number];

/**
 * Builds a structured JSON page from its Markdown content.
 *
 * This function:
 * 1. Parses the page metadata from a YAML file.
 * 2. Extracts available language versions of the content.
 * 3. Reads and parses the Markdown content for each language.
 * 4. Generates structured JSON output for each language version.
 * 5. Saves the generated JSON files in the output directory.
 *
 * @param {OutputPagesStructureItem} outputStructureItem - Metadata for the output structure, including `id`, `route`, and `uuid`.
 * @param {string} pageRef - Path to the YAML file defining the page.
 * @param {string} outputDir - Directory where the processed JSON files will be saved.
 * @param {boolean} minify - Whether to write the output JSON files in minified (single-line) format. If `false`, files will be pretty-printed.
 *
 * **Example Usage:**
 * ```ts
 * await buildPage(
 *   {
 *     id: "css.properties.background-color",
 *     route: "/css/background-color",
 *     uuid: "123e4567-e89b-12d3-a456-426614174000"
 *   },
 *   "./css/properties/background-color/page.yml",
 *   "./dist",
 *   true
 * );
 * ```
 *
 * **Generated Output Structure:**
 * - `dist/pages/123e4567-e89b-12d3-a456-426614174000/ru.json`
 * - `dist/pages/123e4567-e89b-12d3-a456-426614174000/en.json`
 */
export async function buildPage(
  outputStructureItem: OutputPagesStructureItem,
  pageRef: string,
  outputDir: string,
  minify: boolean,
) {
  // Parse the page metadata from the YAML file
  const pageData = await parsePageFile(pageRef);
  const pageDirname = path.dirname(pageRef); // Get the directory where the YAML file is located

  // Extract language-specific content references, filtering only allowed languages
  const contentRefEntries = (
    Object.entries(pageData.content) as Array<[LangKey, string]>
  ).filter(([langKey]) => ALLOWED_LANGUAGES_SET.has(langKey));

  // Process each language version of the content
  for (const [langKey, contentRef] of contentRefEntries) {
    // Parse the Markdown file containing the page content
    const markdownParsedContent = await parseMarkdownFile(
      path.resolve(pageDirname, contentRef),
    );

    // Construct the final JSON structure for the page
    const outputPageData = {
      content: markdownParsedContent,
      meta: pageData.meta, // Page metadata
      properties: {
        description: pageData.properties.description[langKey] ?? '',
        menuTitle: pageData.properties.menuTitle?.[langKey],
        tags: pageData.properties.tags?.[langKey] ?? [],
        title: pageData.properties.title[langKey] ?? '',
      },
    };

    // Define the output path for the JSON file
    const outputFilePath = path.resolve(
      outputDir,
      PAGE_DIRNAME,
      outputStructureItem.uuid,
      `${langKey}.json`,
    );

    // Create the JSON file with structured page data
    await makeJsonFile(outputFilePath, outputPageData, !minify);
  }
}
