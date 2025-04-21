import { parseMarkdownCodeMetaData } from '../parseMarkdownCodeMetaData';

describe('parseMarkdownCodeMetaData function', () => {
  it('parses string, number, boolean, and null values correctly', () => {
    const result = parseMarkdownCodeMetaData(
      'title="Hello world" count=42 enabled=true mode=null',
    );

    expect(result).toEqual({
      title: 'Hello world',
      count: 42,
      enabled: true,
      mode: null,
    });
  });

  it('parses single quoted string', () => {
    const result = parseMarkdownCodeMetaData("label='Single quoted text'");

    expect(result).toEqual({
      label: 'Single quoted text',
    });
  });

  it('defaults to true if value is omitted', () => {
    const result = parseMarkdownCodeMetaData('isActive');
    expect(result).toEqual({ isActive: true });
  });

  it('throws on invalid key (e.g. contains dash)', () => {
    expect(() => parseMarkdownCodeMetaData('invalid-key="value"')).toThrow(
      /Invalid key "invalid-key"/,
    );
  });

  it('throws on multiple "=" in one argument', () => {
    expect(() => parseMarkdownCodeMetaData('foo=bar=baz')).toThrow(
      /Invalid entry "foo=bar=baz"/,
    );
  });

  it('throws on unknown value type', () => {
    expect(() =>
      parseMarkdownCodeMetaData('unknown=valueWithoutQuotes'),
    ).toThrow(/Unknown value type "valueWithoutQuotes"/);
  });

  it('handles multiple key-value pairs with mixed types', () => {
    const result = parseMarkdownCodeMetaData(
      'a=1 b="text" c=true d=false e=null f=3.14',
    );

    expect(result).toEqual({
      a: 1,
      b: 'text',
      c: true,
      d: false,
      e: null,
      f: 3.14,
    });
  });

  it('trims input before processing', () => {
    const result = parseMarkdownCodeMetaData('   key="value"   ');
    expect(result).toEqual({ key: 'value' });
  });
});
