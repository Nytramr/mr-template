import { Template } from '../../index';

describe('Sub Templates', () => {
  describe('define and template actions', () => {
    test('simple define', () => {
      const rangeLoopTpl =
        '{{define "list"}}' + 'Print {{.}}' + '\n' + '{{end}}';

      const template = new Template('My template');
      expect(() => template.parse(rangeLoopTpl)).not.toThrow();

      let text = template.execute({});

      expect(text).toMatchSnapshot();
    });

    test('simple define and template', () => {
      const rangeLoopTpl =
        '{{define "hello"}}' +
        'Print: Hello world!' +
        '{{end}}' +
        '{{template "hello"}}';

      const template = new Template('My template');
      expect(() => template.parse(rangeLoopTpl)).not.toThrow();

      let text = template.execute({});

      expect(text).toMatchSnapshot();
    });

    test('template action with input data', () => {
      const rangeLoopTpl =
        '{{define "hello"}}' +
        'Print: Hello ' +
        '{{ .name }}' +
        '!' +
        '{{end}}' +
        '{{template "hello" .person }}';

      const template = new Template('My template');
      expect(() => template.parse(rangeLoopTpl)).not.toThrow();

      let text = template.execute({ person: { name: 'John' } });

      expect(text).toMatchSnapshot();
    });
  });

  describe('block action', () => {
    test('without input data', () => {
      const rangeLoopTpl =
        '{{block "hello"}}' + 'Print: Hello world!' + '{{end}}';

      const template = new Template('My template');
      expect(() => template.parse(rangeLoopTpl)).not.toThrow();

      let text = template.execute({});

      expect(text).toMatchSnapshot();
    });

    test('with input data', () => {
      const rangeLoopTpl =
        '{{block "hello" .person}}' +
        'Print: Hello ' +
        '{{ .name }}' +
        '!' +
        '{{end}}';

      const template = new Template('My template');
      expect(() => template.parse(rangeLoopTpl)).not.toThrow();

      let text = template.execute({ person: { name: 'Jenny' } });

      expect(text).toMatchSnapshot();
    });
  });
});
