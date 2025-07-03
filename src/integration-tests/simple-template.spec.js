import { Template } from '../index';

describe('Simple templates', () => {
  test('no actions template', async () => {
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

    const template = new Template('My template');
    expect(() => template.parse(templateTpl)).not.toThrow();

    expect(template.execute()).toMatchSnapshot();
  });

  test('Hello world template', async () => {
    const template = new Template('My template');
    expect(() => template.parse('Hello {{.}}!')).not.toThrow();

    expect(template.execute('world')).toBe('Hello world!');
    expect(template.execute('John')).toBe('Hello John!');
  });

  test('Template with comments', async () => {
    const templateTpl =
      '{{/* This is a comment */}}' +
      '{{/* This is also a comment */ -}}\n' +
      "Hello{{' '}}" +
      '\n' +
      '{{- /* This is another comment */}}' +
      '{{.}}\n' +
      '{{- /* This is yet another comment */ -}}' +
      '\n!';

    const template = new Template('My template');
    expect(() => template.parse(templateTpl)).not.toThrow();

    expect(template.execute('world')).toBe('Hello world!');
    expect(template.execute('John')).toBe('Hello John!');
  });

  test('Text and spaces template', async () => {
    const template = new Template('My template');
    expect(() => template.parse('{{23 -}} < {{- 45}}')).not.toThrow();

    expect(template.execute()).toBe('23<45');
  });
});
