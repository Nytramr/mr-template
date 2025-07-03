import { Template } from './index';

describe('template rendering', () => {
  function join(char, ...strings) {
    return strings.join(char);
  }

  function toLowerCase(string = '') {
    return string.toLowerCase();
  }

  describe('GoLang examples', () => {
    it.each([
      ['"output"', {}],
      ['"output"{{/* Comment */}}', {}],
      ['{{.}}', '"output"'],
      ['{{.output}}', { output: '"output"' }],
      ['{{"\\"output\\""}}', {}],
      ['{{`"output"`}}', {}],
      ['{{printf "%q" "output"}}', {}],
      ['{{"output" | printf "%q"}}', {}],
      ['{{"put" | printf "%s%s" "out" | printf "%q"}}', {}],
      ['{{printf "%q" (print "out" "put")}}', {}],
      ['{{and (or .true false) "output" | printf "%q"}}', { true: true }],
      [
        '{{ and (eq .prop "value") "put\\"" | print "\\"out" }}',
        { prop: 'value' },
      ],
      [
        '{{ and ("value" | eq .prop) "put\\"" | print "\\"out" }}',
        { prop: 'value' },
      ],
      ['{{ and (eq (len "four") 4) "put\\"" | print "\\"out" }}', {}],
      [
        '{{ index .collection 1 3 | printf "%q" }}',
        { collection: ['a', [1, 2, 'b', 'output']] },
      ],
      ['{{ slice "This output works" 5 11 | printf "%q" }}', {}],
      [
        '{{ call .join "" `"` .out .put `"` }}',
        { join, out: 'out', put: 'put' },
      ],
      ['{{ call .join "t" `"ou` `pu` `"` }}', { join }],
      ['{{ call .join "t" `"ou` `pu` `"` }}', { join }],
      ['{{ toLowerCase "\\"OUTPUT\\"" }}', {}],
      ['{{ .output | toLowerCase | printf "%q" }}', { output: 'OUTPUT' }],
      ['{{$x := "output"}}{{printf "%q" $x}}', {}],
      ['{{$x := nil}}{{$x = "output"}}{{printf "%q" $x}}', {}],
      ['{{$x := "output" | printf "%q"}}{{$x}}', {}],
      ['{{with "output"}}{{printf "%q" .}}{{end}}', {}],
      ['{{with $x := "output"}}{{printf "%q" $x}}{{end}}', {}],
      ['{{with $x := "output" | printf "%q"}}{{$x}}{{end}}', {}],
      ['{{with $x := "output"}}{{$x | printf "%q"}}{{end}}', {}],
    ])('%s should render "output"', (templateText, data) => {
      const template = new Template('template 1')
        .funcs({ toLowerCase })
        .parse(templateText);

      const result = template.execute(data);
      expect(result).toBe('"output"');
    });
  });
});
