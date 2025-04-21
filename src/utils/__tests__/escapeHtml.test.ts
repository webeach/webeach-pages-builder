import { escapeHtml } from '../escapeHtml';

describe('escapeHtml util', () => {
  it('escapes &, <, >, ", and \' characters', () => {
    const input = `5 > 3 && x < y && title="Hello" && note='OK'`;
    const expected =
      '5 &gt; 3 &amp;&amp; x &lt; y &amp;&amp; title=&quot;Hello&quot; &amp;&amp; note=&#39;OK&#39;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('returns the same string if no escapable characters', () => {
    const input = `Hello world! 123`;
    expect(escapeHtml(input)).toBe(input);
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('escapes a string with only one special character', () => {
    expect(escapeHtml('&')).toBe('&amp;');
    expect(escapeHtml('<')).toBe('&lt;');
    expect(escapeHtml('>')).toBe('&gt;');
    expect(escapeHtml('"')).toBe('&quot;');
    expect(escapeHtml("'")).toBe('&#39;');
  });

  it('leaves non-ASCII characters unchanged', () => {
    expect(escapeHtml('Привет < мир >')).toBe('Привет &lt; мир &gt;');
    expect(escapeHtml('😀 & 😎')).toBe('😀 &amp; 😎');
  });

  it('escapes dangerous HTML to prevent injection', () => {
    const rawCode = `<script>alert("xss")</script>\nconst a = 5 < 10 && b > 2;`;
    const escaped = escapeHtml(rawCode);

    const expected = [
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      'const a = 5 &lt; 10 &amp;&amp; b &gt; 2;',
    ].join('\n');

    expect(escaped).toBe(expected);
  });
});
