#!/usr/bin/env node

import process from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { buildAllPages } from '../functions/buildAllPages';

/**
 * CLI script to build all pages from a structured input file.
 *
 * This script:
 * - Parses command-line arguments using `yargs`
 * - Executes the `buildAllPages` function with provided options
 *
 * **Usage:**
 * ```sh
 * webeach-pages-builder build-pages --inputFile=./content/structure.yml --outputDir=dist
 * ```
 *
 * **Available Commands:**
 * - `build-pages`: Builds all pages based on the provided input file.
 *
 * **Options:**
 * - `--inputFile <path>`  (required) — Path to the file containing the page structure.
 * - `--outputDir <path>`  (optional, default: `"dist"`) — Output directory where pages will be built.
 * - `--minify`            (optional, default: `true`) — If enabled, outputs JSON in minified (single-line) format.
 *                                      Pass `--minify=false` to pretty-print JSON instead.
 */

(async () => {
  const argv = await yargs(hideBin(process.argv))
    .command('build-pages', 'Build all pages') // Defines the main CLI command
    .option('inputFile', {
      type: 'string',
      demandOption: true,
      describe: 'Path to the file containing the structure of all pages',
    })
    .option('outputDir', {
      type: 'string',
      default: 'dist',
      describe: 'The output directory where all pages will be built',
    })
    .option('minify', {
      type: 'boolean',
      default: true,
      describe: 'Write output JSON files in minified (single-line) format',
    })
    .help().argv;

  // Execute the build function with provided CLI arguments
  await buildAllPages(argv.inputFile, argv.outputDir, argv.minify);
})().catch((error: Error) => {
  console.error('Error:', error.message); // Display a user-friendly error message
  process.exit(1); // Exit the process with a failure code
});
