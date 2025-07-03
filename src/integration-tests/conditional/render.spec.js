import { Template } from '../../index';

describe('Template with conditionals', () => {
  test('simple conditional', async () => {
    const conditionalTpl =
      'Beginning of the file' +
      '\n' +
      '{{if .}} The value is truthy {{end}}' +
      '\n' +
      'End of the file' +
      '\n';

    const template = new Template('My template');
    expect(() => template.parse(conditionalTpl)).not.toThrow();

    expect(template.execute(true)).toMatchSnapshot();
    expect(template.execute(false)).toMatchSnapshot();
  });

  test('conditional with else', async () => {
    const conditionalTpl =
      'Beginning of the file' +
      '\n' +
      '{{if .}}' +
      '\n' +
      'The value is truthy' +
      '\n' +
      '{{else}}' +
      '\n' +
      'The value is falsy' +
      '\n' +
      '{{end}}' +
      '\n' +
      'End of the file' +
      '\n';

    const template = new Template('My template');
    expect(() => template.parse(conditionalTpl)).not.toThrow();

    expect(template.execute(true)).toMatchSnapshot();
    expect(template.execute(false)).toMatchSnapshot();
  });

  test('conditional with else if', async () => {
    const conditionalTpl =
      'Beginning of the file' +
      '\n' +
      '{{if eq . "a"}}' +
      '\n' +
      'The value is "a"' +
      '\n' +
      '{{else if eq . "b"}}' +
      '\n' +
      'The value is "b"' +
      '\n' +
      '{{else if eq . "c"}}' +
      '\n' +
      'The value is "c"' +
      '\n' +
      '{{else}}' +
      '\n' +
      'The value is other than "a", "b" or "c"' +
      '\n' +
      '{{end}}' +
      '\n' +
      'End of the file' +
      '\n';
    const template = new Template('My template');
    expect(() => template.parse(conditionalTpl)).not.toThrow();

    expect(template.execute('a')).toMatchSnapshot();
    expect(template.execute('b')).toMatchSnapshot();
    expect(template.execute('c')).toMatchSnapshot();
    expect(template.execute('z')).toMatchSnapshot();
  });
});
