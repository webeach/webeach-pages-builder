import { normalizePageRoute } from '../normalizePageRoute';

describe('normalizePageRoute', () => {
  it('normalizes string input into object with empty aliases', () => {
    const result = normalizePageRoute('/css/background-color');
    expect(result).toEqual({
      path: '/css/background-color',
      aliases: [],
    });
  });

  it('returns the same object if aliases are defined', () => {
    const input = {
      path: '/css/border-radius',
      aliases: ['/css/-webkit-border-radius', '/css/-moz-border-radius'],
    };

    const result = normalizePageRoute(input);
    expect(result).toEqual(input); // aliases сохраняются как есть
  });

  it('adds empty aliases if aliases field is missing', () => {
    const input = {
      path: '/css/z-index',
    };

    const result = normalizePageRoute(input);
    expect(result).toEqual({
      path: '/css/z-index',
      aliases: [],
    });
  });

  it('adds empty aliases if aliases is explicitly undefined', () => {
    const input = {
      path: '/css/display',
      aliases: undefined,
    };

    const result = normalizePageRoute(input);
    expect(result).toEqual({
      path: '/css/display',
      aliases: [],
    });
  });
});
