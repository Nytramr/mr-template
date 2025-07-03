import { Template } from '../../index';

describe('Template with scope-selection', () => {
  test('simple scope selection', () => {
    const scopeSelectionTpl =
      'Beginning of the file' +
      '\n' +
      'Global value is {{.value}}' +
      '\n' +
      "{{with .scope}}The scope's value is {{.value}}{{end}}" +
      '\n' +
      'End of the file' +
      '\n';

    const template = new Template('My template');
    expect(() => template.parse(scopeSelectionTpl)).not.toThrow();

    expect(
      template.execute({ value: 100, scope: { value: 200 } }),
    ).toMatchSnapshot();
    expect(
      template.execute({ value: 'a', scope: { value: 'b' } }),
    ).toMatchSnapshot();
  });

  test('scope selection with "else" fallback', () => {
    const scopeSelectionTpl =
      'Beginning of the file' +
      '\n' +
      'Global value is {{.value}}' +
      '\n' +
      '{{with .scope}}' +
      '\n' +
      "The scope's value is {{.value}}" +
      '\n' +
      '{{else}}' +
      '\n' +
      'The scope is undefined' +
      '\n' +
      '{{end}}' +
      '\n' +
      'End of the file' +
      '\n';

    const template = new Template('My template');
    expect(() => template.parse(scopeSelectionTpl)).not.toThrow();

    expect(
      template.execute({ value: 100, scope: { value: 200 } }),
    ).toMatchSnapshot();
    expect(template.execute({ value: 100 })).toMatchSnapshot();
  });

  test('scope selection with "else" and "else with" fallback', () => {
    const scopeSelectionTpl =
      'Beginning of the file' +
      '\n' +
      'Global value is {{.value}}' +
      '\n' +
      '{{with .scope1}}' +
      '\n' +
      "The scope1's value is {{.value}}" +
      '\n' +
      '{{else with .scope2}}' +
      '\n' +
      "The scope'2 value is {{.value}}" +
      '\n' +
      '{{else}}' +
      '\n' +
      'Every scope is undefined' +
      '\n' +
      '{{end}}' +
      '\n' +
      'End of the file' +
      '\n';

    const template = new Template('My template');
    expect(() => template.parse(scopeSelectionTpl)).not.toThrow();

    expect(
      template.execute({
        value: 100,
        scope1: { value: 200 },
        scope2: { value: 300 },
      }),
    ).toMatchSnapshot();
    expect(
      template.execute({
        value: 100,
        scope2: { value: 300 },
      }),
    ).toMatchSnapshot();
    expect(template.execute({ value: 100 })).toMatchSnapshot();
  });

  test('scope selection with nested scopes', () => {
    const scopeSelectionTpl = `Beginning of the file
Global value is {{.value}}
{{with .scope1}}
The scope1's value is {{.value}}
{{with ._1}}
The scope1_1's value is {{.value}}
{{else}}
The scope1_1 is undefined
{{end}}{{else with .scope2}}
The scope'2 value is {{.value}}
{{else}}
Every scope is undefined
{{end}}
End of the file`;

    const template = new Template('My template');
    expect(() => template.parse(scopeSelectionTpl)).not.toThrow();

    expect(
      template.execute({
        value: 100,
        scope1: { value: 200, _1: { value: 250 } },
        scope2: { value: 300, _1: { value: 350 } },
      }),
    ).toMatchSnapshot();
    expect(
      template.execute({
        value: 100,
        scope1: { value: 200 },
        scope2: { value: 300, _1: { value: 350 } },
      }),
    ).toMatchSnapshot();
    expect(
      template.execute({
        value: 100,
        scope2: { value: 300, _1: { value: 350 } },
      }),
    ).toMatchSnapshot();
    expect(template.execute({ value: 100 })).toMatchSnapshot();
  });
});
