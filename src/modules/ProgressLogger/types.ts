/**
 * Options to configure the ProgressLogger instance.
 */
export interface ProgressLoggerOptions {
  /**
   * A function that receives progress values and returns a formatted string.
   * This string is shown in the progress line.
   */
  textHandler: ProgressLoggerTextHandler;

  /**
   * The total number of items to track progress against.
   */
  total: number;
}

/**
 * A function that formats the progress line using the current state.
 *
 * @param values - An object containing current progress values.
 * @returns A formatted string to display as progress.
 */
export type ProgressLoggerTextHandler = (
  values: ProgressLoggerTextHandlerValues,
) => string;

/**
 * Values passed to the textHandler for formatting progress output.
 */
export interface ProgressLoggerTextHandlerValues {
  /**
   * The current count of processed items.
   */
  counter: number;

  /**
   * The percentage of completion (integer from 0 to 100).
   */
  percentage: number;

  /**
   * The total number of items to process.
   */
  total: number;
}
