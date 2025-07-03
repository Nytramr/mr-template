import { escapeHTML, escapeJS, toUnicode } from './string-utils';

describe('String Utils', () => {
  describe('escapeHTML', () => {
    it.each`
      input                                | result
      ${'Hello world!'}                    | ${'Hello world!'}
      ${'<title>This is not HTML</title>'} | ${'&lt;title&gt;This is not HTML&lt;/title&gt;'}
      ${'"& this isn\'t HTML either"'}     | ${'&#39;&amp; this isn&#34;t HTML either&#39;'}
    `('should return the result sanitized', ({ input, result }) => {
      const htmlText = escapeHTML(input);

      expect(htmlText).toBe(result);
    });
  });

  describe('escapeJS', () => {
    /**
     */
    it.each`
      input                                   | result
      ${'a'}                                  | ${'a'}
      ${"'foo"}                               | ${"\\'foo"}
      ${'Go "jump" \\'}                       | ${'Go \\"jump\\" \\\\'}
      ${'Yukihiro says "今日は世界"'}         | ${'Yukihiro says \\"今日は世界\\"'}
      ${'unprintable \uFFFE'}                 | ${'unprintable \\uFFFE'}
      ${'unprintable \n'}                     | ${'unprintable \\u000A'}
      ${'<html>'}                             | ${'\\u003Chtml\\u003E'}
      ${'no = in attributes'}                 | ${'no \\u003D in attributes'}
      ${'&#x27; does not become HTML entity'} | ${'\\u0026#x27; does not become HTML entity'}
    `('should return the result sanitized', ({ input, result }) => {
      const jsText = escapeJS(input);

      expect(jsText).toBe(result);
    });
  });

  describe('toUnicode', () => {
    /**
     */
    it.each`
      input       | result
      ${'\n'}     | ${'\\u000A'}
      ${'A'}      | ${'\\u0041'}
      ${'\uFFFE'} | ${'\\uFFFE'}
    `('should return the unicode for the input', ({ input, result }) => {
      const unicodeText = toUnicode(input);

      expect(unicodeText).toBe(result);
    });
  });
});
