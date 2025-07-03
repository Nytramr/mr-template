import { Template } from '../../index';

describe('Template with Range Loop', () => {
  test('simple range', () => {
    const rangeLoopTpl =
      'Beginning of the file' +
      '\n' +
      '{{range .range}}' +
      'Loop {{.}}, ' +
      '{{end}}' +
      '\n' +
      'End of the file' +
      '\n';

    const template = new Template('My template');
    expect(() => template.parse(rangeLoopTpl)).not.toThrow();

    expect(template.execute({ range: [1, 2, 3, 4, 5] })).toMatchSnapshot();
    expect(
      template.execute({ range: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } }),
    ).toMatchSnapshot();
    expect(template.execute({ range: 'abcdef' })).toMatchSnapshot();
  });

  test('nested range', () => {
    const rangeLoopTpl = `Beginning of the file
{{- range .range}}
  Loop:
  {{- range . -}}
    {{' '}}{{.}},
  {{- end}}
  End loop
{{end -}}
End of the file`;

    const template = new Template('My template');
    expect(() => template.parse(rangeLoopTpl)).not.toThrow();

    expect(
      template.execute({ range: [[1, 2, 3], [4], [5, 6]] }),
    ).toMatchSnapshot();
    expect(
      template.execute({ range: { a: 'abc', b: ['d', 'e'], c: 'f', d: 'g' } }),
    ).toMatchSnapshot();
  });

  test('range with a constant', () => {
    const rangeLoopTpl =
      'Beginning of the file' +
      '\n' +
      '{{range "str range render"}}' +
      '{{.}}, ' +
      '{{end}}' +
      '\n' +
      'End of the file' +
      '\n';

    const template = new Template('My template');
    expect(() => template.parse(rangeLoopTpl)).not.toThrow();

    const render = template.execute({});

    expect(render).toMatchSnapshot();
    expect(template.execute('Some other value')).toEqual(render);
  });

  test('with "else" fallback', () => {
    const rangeLoopTpl =
      'Beginning of the file' +
      '\n' +
      '{{range .range}}' +
      'Loop {{.}}' +
      '\n' +
      '{{else}}' +
      '\n' +
      'The range is empty' +
      '\n' +
      '{{end}}' +
      '\n' +
      'End of the file' +
      '\n';

    const template = new Template('My template');
    expect(() => template.parse(rangeLoopTpl)).not.toThrow();

    expect(template.execute({ range: 5 })).toMatchSnapshot();
    expect(template.execute({ range: 0 })).toMatchSnapshot();
  });

  test('with "break"', () => {
    const rangeLoopTpl =
      'Beginning of the file\n' +
      '{{range .range}}' +
      'Loop {{.}}\n' +
      '{{if eq . 3}}' +
      '{{break}}' +
      '{{end}}' +
      '{{end}}' +
      'End of the file\n';

    const template = new Template('My template');
    expect(() => template.parse(rangeLoopTpl)).not.toThrow();

    expect(template.execute({ range: 10 })).toMatchSnapshot();
    expect(
      template.execute({ range: [1, '5', 'a', 30, '3', 'b', 3, 'c'] }),
    ).toMatchSnapshot();
  });

  test('with "continue"', () => {
    const rangeLoopTpl =
      'Beginning of the file\n' +
      '{{range .range}}' +
      '{{if gt . 3}}' +
      '{{continue}}' +
      '{{end}}' +
      'Loop {{.}}\n' +
      '{{end}}' +
      'End of the file\n';

    const template = new Template('My template');
    expect(() => template.parse(rangeLoopTpl)).not.toThrow();

    expect(template.execute({ range: 10 })).toMatchSnapshot();
    expect(
      template.execute({ range: [1, 5, 'a', 30, 6, 'b', 3, 'c'] }),
    ).toMatchSnapshot();
  });

  describe('With variables', () => {
    describe('declared inline', () => {
      test('element only', () => {
        const rangeLoopTpl =
          'Beginning of the file' +
          '\n' +
          '{{range $x := .range}}' +
          'Loop {{$x}},' +
          '{{end}}' +
          '\n' +
          'End of the file' +
          '\n';

        const template = new Template('My template');
        expect(() => template.parse(rangeLoopTpl)).not.toThrow();

        expect(template.execute({ range: [1, 2, 3, 4, 5] })).toMatchSnapshot();
        expect(template.execute({ range: 'abcdef' })).toMatchSnapshot();
      });

      test('key and element', () => {
        const rangeLoopTpl =
          'Beginning of the file' +
          '\n' +
          '{{range $i, $x := .range}}' +
          'Loop {{$i}}: {{$x}},' +
          '{{end}}' +
          '\n' +
          'End of the file' +
          '\n';

        const template = new Template('My template');
        expect(() => template.parse(rangeLoopTpl)).not.toThrow();

        expect(
          template.execute({ range: ['a', 'b', 'c', 'd', 'e', 'f'] }),
        ).toMatchSnapshot();
        expect(
          template.execute({ range: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } }),
        ).toMatchSnapshot();
      });
    });

    describe('previously declared', () => {
      test('element only', () => {
        const rangeLoopTpl =
          'Beginning of the file' +
          '\n' +
          '{{$x := ""}}' +
          '{{range $x = .range}}' +
          'Loop {{$x}},' +
          '{{end}}' +
          '\n' +
          'End of the file' +
          '\n';

        const template = new Template('My template');
        expect(() => template.parse(rangeLoopTpl)).not.toThrow();

        expect(template.execute({ range: [1, 2, 3, 4] })).toMatchSnapshot();
        expect(template.execute({ range: 'abcde' })).toMatchSnapshot();
      });

      test('key and element', () => {
        const rangeLoopTpl =
          'Beginning of the file' +
          '\n' +
          '{{$i := ""}}' +
          '{{$x := ""}}' +
          '{{range $i, $x = .range}}' +
          'Loop {{$i}}: {{$x}},' +
          '{{end}}' +
          '\n' +
          'End of the file' +
          '\n';

        const template = new Template('My template');
        expect(() => template.parse(rangeLoopTpl)).not.toThrow();

        expect(
          template.execute({ range: ['A', 'B', 'C', 'D'] }),
        ).toMatchSnapshot();
        expect(
          template.execute({ range: { a: 'X', b: 'Y', c: 'Z' } }),
        ).toMatchSnapshot();
      });
    });
  });
});
