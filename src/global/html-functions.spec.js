import { Constant } from '../nodes/constant-node';
import { executeOperator } from './test-utils';
import { html, js, urlquery } from './html-functions';

const stringConstant = new Constant('Hello world!');

describe('HTML functions', () => {
  describe('html', () => {
    it('should return a function', () => {
      expect(html(stringConstant)).toBeInstanceOf(Function);
    });

    it.each`
      strings                                        | result
      ${['Hello world!']}                            | ${'Hello world!'}
      ${['<title>This is not HTML</title>']}         | ${'&lt;title&gt;This is not HTML&lt;/title&gt;'}
      ${['<title>', 'This is not HTML</', 'title>']} | ${'&lt;title&gt;This is not HTML&lt;/title&gt;'}
      ${['"& ', 'this isn\'t HTML either"']}         | ${'&#39;&amp; this isn&#34;t HTML either&#39;'}
    `('should return the result sanitized', ({ strings, result }) => {
      let nodes = strings.map((str) => Constant.stringConstant(str));
      const htmlNode = html(...nodes);

      expect(htmlNode({})).toBe(result);
    });

    it('should include piped arg', () => {
      const string = '<either>';
      const stringConst = Constant.stringConstant('"& this isn\'t HTML"');
      const fn = html(stringConst);
      expect(executeOperator(fn, string)).toBe(
        '&#39;&amp; this isn&#34;t HTML&#39;&lt;either&gt;',
      );
    });
  });

  describe('urlquery', () => {
    it('should return a function', () => {
      expect(urlquery(stringConstant)).toBeInstanceOf(Function);
    });

    it.each`
      strings                                                  | result
      ${['Hello world!']}                                      | ${'Hello%20world!'}
      ${['http://www.example.org/?query 1=4&query2=true']}     | ${'http%3A%2F%2Fwww.example.org%2F%3Fquery%201%3D4%26query2%3Dtrue'}
      ${['http://www.example.org/', '?query 1=4&query2=true']} | ${'http%3A%2F%2Fwww.example.org%2F%3Fquery%201%3D4%26query2%3Dtrue'}
    `('should return the result sanitized', ({ strings, result }) => {
      let nodes = strings.map((str) => Constant.stringConstant(str));
      const htmlNode = urlquery(...nodes);

      expect(htmlNode({})).toBe(result);
    });

    it('should include piped arg', () => {
      const string = '?query 1=4&query2=true';
      const stringConst = Constant.stringConstant('http://www.example.org/');
      const fn = urlquery(stringConst);
      expect(executeOperator(fn, string)).toBe(
        'http%3A%2F%2Fwww.example.org%2F%3Fquery%201%3D4%26query2%3Dtrue',
      );
    });
  });

  describe('js', () => {
    it('should return a function', () => {
      expect(js(stringConstant)).toBeInstanceOf(Function);
    });

    it.each`
      strings                                          | result
      ${['<script>', 'alert("gotcha!")', '</script>']} | ${'\\u003Cscript\\u003Ealert(\\"gotcha!\\")\\u003C/script\\u003E'}
    `('should return the result sanitized', ({ strings, result }) => {
      let nodes = strings.map((str) => Constant.stringConstant(str));
      const jsNode = js(...nodes);

      expect(jsNode({})).toBe(result);
    });

    it('should include piped arg', () => {
      const string = '34; \n';
      const stringConst = Constant.stringConstant('const a = ');
      const fn = js(stringConst);
      expect(executeOperator(fn, string)).toBe('const a \\u003D 34; \\u000A');
    });
  });
});
