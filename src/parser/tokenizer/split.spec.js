import { splitInTokens } from './split';

describe('splitInTokens', () => {
  test('no actions template', () => {
    const templateTpl =
      'This is a template' +
      '\n' +
      'With no Actions' +
      '\n' +
      'Some "strings"' +
      '\n' +
      '\n' +
      'And some scaped Actions' +
      '\n' +
      '\n' +
      '{\\{ this is not an action }}' +
      '\n';

    let result = splitInTokens(templateTpl);

    expect(result).toMatchSnapshot();
  });

  test('Hello world template', () => {
    let result = splitInTokens('Hello {{.}}!');

    expect(result).toMatchSnapshot();
  });

  test('Template with comments', () => {
    const templateTpl =
      '{{/* This is a comment */}}' +
      '{{/* This is also a comment */ -}}\n' +
      'Hello ' +
      '\n' +
      '{{- /* This is another comment */}}' +
      '\t{{.}}\n' +
      '{{- /* This is yet another comment */ -}}' +
      '\n!';

    let result = splitInTokens(templateTpl);

    expect(result).toMatchSnapshot();
  });

  test('Text and spaces template', () => {
    let result = splitInTokens('{{23 -}} < {{- 45}}');

    expect(result).toMatchSnapshot();
  });

  test('Empty action', () => {
    let result = splitInTokens('Hello {{}}world!');

    expect(result).toMatchSnapshot();
  });

  test('Template with different actions', () => {
    const templateTpl =
      '{{/* This is a comment */ -}}\n' +
      '{{define "hello"}}\n' +
      '\tPrint: Hello ' +
      '{{ .name }}' +
      '!' +
      '{{end -}}' +
      '\n{{.}}\n' +
      '{{range .range}}' +
      'Loop {{.}}\n' +
      '{{if eq . 3}}' +
      '{{break}}' +
      '{{end}}' +
      '{{end}}\n' +
      '{{- template "hello" .person }}';

    let result = splitInTokens(templateTpl);

    expect(result).toMatchSnapshot();
  });

  test('Template with unclosed actions', () => {
    const templateTpl =
      '{{if .}}\n{{Dot is true\n{{else}}\nline1 {{"x" "y"\n{{end}}';

    let result = splitInTokens(templateTpl);

    expect(result).toMatchSnapshot();
  });
});
