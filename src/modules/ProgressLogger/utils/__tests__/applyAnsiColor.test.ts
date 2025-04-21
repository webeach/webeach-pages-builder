import { AnsiColor, applyAnsiColor } from '../applyAnsiColor';

describe('applyAnsiColor util', () => {
  const colorCodes: Record<AnsiColor, number> = {
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    purple: 35,
    cyan: 36,
    white: 37,
  };

  it.each(Object.entries(colorCodes))(
    'wraps text with correct ANSI code for color "%s"',
    (color, code) => {
      const result = applyAnsiColor('Hello', color as AnsiColor);
      expect(result).toBe(`\x1b[${code}mHello\x1b[0m`);
    },
  );

  it('works with empty string', () => {
    const result = applyAnsiColor('', 'green');
    expect(result).toBe(`\x1b[32m\x1b[0m`);
  });
});
