import readline from 'node:readline';

import { ProgressLogger } from '../ProgressLogger';

describe('ProgressLogger module', () => {
  let output: string[];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    output = [];

    vi.spyOn(process.stdout, 'write').mockImplementation(
      (str: string | Uint8Array) => {
        if (typeof str === 'string') output.push(str);
        return true;
      },
    );

    vi.spyOn(readline, 'moveCursor').mockImplementation(() => false);
    vi.spyOn(readline, 'clearLine').mockImplementation(() => false);
    vi.spyOn(readline, 'cursorTo').mockImplementation(() => false);
  });

  it('prints initial progress on creation', () => {
    new ProgressLogger({
      total: 100,
      textHandler: ({ counter, total, percentage }) =>
        `Progress: ${counter}/${total} (${percentage}%)`,
    });

    expect(output).toEqual(['\x1b[36mProgress: 0/100 (0%)\x1b[0m\n']);
  });

  it('logs a message and updates progress', () => {
    const logger = new ProgressLogger({
      total: 10,
      textHandler: ({ counter, total, percentage }) =>
        `Progress: ${counter}/${total} (${percentage}%)`,
    });

    output.length = 0; // очищаем начальный прогресс

    logger.log('Processed file_1.txt');

    expect(output).toEqual([
      'Processed file_1.txt\n',
      '\x1b[36mProgress: 0/10 (0%)\x1b[0m\n',
    ]);
  });

  it('updates progress when counter is set', () => {
    const logger = new ProgressLogger({
      total: 4,
      textHandler: ({ counter, total, percentage }) =>
        `Progress: ${counter}/${total} (${percentage}%)`,
    });

    output.length = 0;

    logger.counter = 2;

    expect(output).toEqual(['\x1b[36mProgress: 2/4 (50%)\x1b[0m\n']);
  });

  it('applies ANSI color to log message if provided', () => {
    const logger = new ProgressLogger({
      total: 1,
      textHandler: () => 'Progress: ?',
    });

    output.length = 0;

    logger.log('Hello', 'red');

    expect(output).toEqual([
      '\x1b[31mHello\x1b[0m\n',
      '\x1b[36mProgress: ?\x1b[0m\n',
    ]);
  });

  it('applies cyan ANSI color to progress line by default', () => {
    const logger = new ProgressLogger({
      total: 2,
      textHandler: () => 'Progress: ok',
    });

    output.length = 0;

    logger.counter = 1;

    expect(output).toEqual(['\x1b[36mProgress: ok\x1b[0m\n']);
  });
});
