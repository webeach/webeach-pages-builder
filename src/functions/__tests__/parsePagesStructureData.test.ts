import { ZodError } from 'zod';

import { parsePagesStructureData } from '../parsePagesStructureData';

describe('parsePagesStructureData function', () => {
  it('parses valid structure with multiple pages', () => {
    const validData = {
      pages: [
        {
          id: 'html.tags.div',
          route: '/html/div',
          ref: './html/tags/div/page.yml',
        },
        {
          id: 'css.properties.background-color',
          route: '/css/background-color',
          ref: './css/properties/background-color/page.yml',
        },
      ],
    };

    const result = parsePagesStructureData(validData);
    expect(result).toEqual(validData);
  });

  it('parses valid structure with empty pages array', () => {
    const result = parsePagesStructureData({ pages: [] });
    expect(result).toEqual({ pages: [] });
  });

  it('throws ZodError if pages field is missing', () => {
    expect(() => parsePagesStructureData({})).toThrow(ZodError);
  });

  it('throws ZodError if page item is missing fields', () => {
    const invalid = {
      pages: [
        {
          id: 'html.tags.div',
          // missing route and ref
        },
      ],
    };

    expect(() => parsePagesStructureData(invalid)).toThrow(ZodError);
  });

  it('throws ZodError for wrong types in fields', () => {
    const invalid = {
      pages: [
        {
          id: 123,
          route: true,
          ref: null,
        },
      ],
    };

    expect(() => parsePagesStructureData(invalid)).toThrow(ZodError);
  });

  it('throws ZodError if pages is not an array', () => {
    const invalid = {
      pages: 'not-an-array',
    };

    expect(() => parsePagesStructureData(invalid)).toThrow(ZodError);
  });
});
