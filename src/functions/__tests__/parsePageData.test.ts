import { ZodError } from 'zod';

import { parsePageData } from '../parsePageData';

describe('parsePageData function', () => {
  it('parses valid page data successfully', () => {
    const validData = {
      content: {
        ru: 'Текст контента',
      },
      properties: {
        title: {
          ru: 'background-color',
        },
        description: {
          ru: 'Описание свойства',
        },
        tags: {
          ru: ['css', 'background'],
        },
      },
    };

    const result = parsePageData(validData);
    expect(result).toEqual(validData);
  });

  it('throws if required field is missing', () => {
    const invalidData = {
      properties: {
        title: { ru: 'test' },
        description: { ru: 'desc' },
        tags: { ru: ['css'] },
      },
    };

    expect(() => parsePageData(invalidData)).toThrow(ZodError);
  });

  it('throws if tags is not an array', () => {
    const invalidData = {
      content: { ru: 'Контент' },
      properties: {
        title: { ru: 'background-color' },
        description: { ru: 'Описание' },
        tags: { ru: 'css' }, // должно быть массивом
      },
    };

    expect(() => parsePageData(invalidData)).toThrow(ZodError);
  });

  it('throws if content is not a string map', () => {
    const invalidData = {
      content: { ru: 123 }, // должен быть string
      properties: {
        title: { ru: 'background-color' },
        description: { ru: 'Описание' },
        tags: { ru: ['css'] },
      },
    };

    expect(() => parsePageData(invalidData)).toThrow(ZodError);
  });

  it('allows multiple locales if they are valid', () => {
    const data = {
      content: {
        ru: 'Привет',
        en: 'Hello',
      },
      properties: {
        title: {
          ru: 'Название',
          en: 'Title',
        },
        description: {
          ru: 'Описание',
          en: 'Description',
        },
        tags: {
          ru: ['css', 'background'],
          en: ['css', 'background'],
        },
      },
    };

    const result = parsePageData(data);
    expect(result).toEqual(data);
  });
});
