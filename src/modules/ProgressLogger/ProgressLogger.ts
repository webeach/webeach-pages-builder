import readline from 'node:readline';

import { AnsiColor, applyAnsiColor } from './utils/applyAnsiColor';

import { ProgressLoggerOptions, ProgressLoggerTextHandler } from './types';

/**
 * A utility class to log messages with a persistent progress indicator at the bottom.
 *
 * Logs are printed line-by-line above, while a single progress line remains updated at the bottom.
 */
export class ProgressLogger {
  /** Internal counter tracking the current progress */
  private _counter = 0;

  /** Function used to format the progress display text */
  private readonly textHandler: ProgressLoggerTextHandler;

  /** Total number of steps/files/items to process */
  private readonly total: number;

  /**
   * Initializes a new instance of the ProgressLogger.
   *
   * @param {ProgressLoggerOptions} options - Configuration options including text formatter and total count.
   */
  constructor({ textHandler, total }: ProgressLoggerOptions) {
    this.textHandler = textHandler;
    this.total = total;

    this.printProgress(); // Initial print to reserve the progress line
  }

  /**
   * Logs a message above the progress line and updates the progress display.
   *
   * @param {string | number} message - The log message to display.
   * @param {AnsiColor} [color] - Optional ANSI color to apply to the message.
   */
  public log(message: string | number, color?: AnsiColor) {
    // Move up to the progress line and clear it
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);

    // Format the message with optional color
    const finalMessage = color
      ? applyAnsiColor(message.toString(), color)
      : message;

    // Print the message and re-render the progress
    process.stdout.write(`${finalMessage}\n`);
    this.printProgress();
  }

  /**
   * Gets the current progress counter.
   */
  get counter() {
    return this._counter;
  }

  /**
   * Sets the progress counter and updates the progress display.
   */
  set counter(value: number) {
    this._counter = value;

    // Move up to the progress line and clear it before updating
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);

    this.printProgress();
  }

  /**
   * Renders the current progress line using the text handler.
   * Always stays at the bottom of the terminal.
   */
  private printProgress() {
    const progressText = this.textHandler({
      counter: this.counter,
      percentage: Math.floor((this.counter / this.total) * 100),
      total: this.total,
    });

    readline.cursorTo(process.stdout, 0);

    // Apply a default cyan color to the progress line
    const finalProgressText = applyAnsiColor(progressText, 'cyan');

    process.stdout.write(`${finalProgressText}\n`);
  }
}
