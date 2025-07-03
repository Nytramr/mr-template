import { LiteralText, Sequence, DataAccessor } from '../nodes';
import { Parser } from './parse';

jest.mock('../nodes/literal-text-node');

describe('Parser', () => {
  describe('parse', () => {
    let valueFromTokenSpy;
    beforeEach(() => {
      valueFromTokenSpy = jest.spyOn(DataAccessor, 'fromToken');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should parse an empty string', () => {
      const template = '';
      const parsed = Parser.parse('emptyTemplate', template, {});
      expect(LiteralText).not.toHaveBeenCalled();
      expect(valueFromTokenSpy).not.toHaveBeenCalled();
      expect(parsed['emptyTemplate']).toHaveLength(0);
    });

    test('should parse a template with no actions', () => {
      const template = 'Hello world';
      const parsed = Parser.parse('my template', template, {});
      expect(LiteralText).toHaveBeenCalledWith('Hello world');
      expect(parsed['my template']).toBeInstanceOf(LiteralText);
    });

    test('should parse a simple template', () => {
      const template = 'Hello {{.name}}';
      const parsed = Parser.parse('my template', template, {});
      expect(LiteralText).toHaveBeenCalledWith('Hello ');
      expect(valueFromTokenSpy).toHaveBeenCalledWith(
        expect.objectContaining({ text: '.name' }),
      );
      expect(parsed['my template']).toBeInstanceOf(Sequence);
    });

    test('should parse a template with a nested action', () => {
      const template = 'Hello {{.user.name}}';
      const parsed = Parser.parse('my template', template, {});
      expect(LiteralText).toHaveBeenCalledWith('Hello ');
      expect(valueFromTokenSpy).toHaveBeenCalledWith(
        expect.objectContaining({ text: '.user.name' }),
      );
      expect(parsed['my template']).toBeInstanceOf(Sequence);
    });

    test('should parse a template with an action surrounded by text', () => {
      const template = 'Hello {{.user.name}}!';
      const parsed = Parser.parse('my template', template, {});
      expect(LiteralText).toHaveBeenNthCalledWith(1, 'Hello ');
      expect(valueFromTokenSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ text: '.user.name' }),
      );
      expect(LiteralText).toHaveBeenNthCalledWith(2, '!');
      expect(parsed['my template']).toBeInstanceOf(Sequence);
    });

    test('should parse a template with multiple actions', () => {
      const template =
        'Hello {{.guest.name}}! I am {{.host.name}}, nice to meet you.';
      const parsed = Parser.parse('my template', template, {});
      expect(parsed['my template']).toBeInstanceOf(Sequence);
      expect(LiteralText).toHaveBeenNthCalledWith(1, 'Hello ');
      expect(valueFromTokenSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ text: '.guest.name' }),
      );
      expect(LiteralText).toHaveBeenNthCalledWith(2, '! I am ');
      expect(valueFromTokenSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ text: '.host.name' }),
      );
      expect(LiteralText).toHaveBeenNthCalledWith(3, ', nice to meet you.');
    });
  });

  describe('tokenize', () => {
    let parser;

    beforeEach(() => {
      parser = new Parser('my template');
    });

    it('should return the parser instance', () => {
      expect(parser.tokenize('')).toBe(parser);
    });
  });

  describe('verify', () => {
    let parser;

    beforeEach(() => {
      parser = new Parser('my template').tokenize('');
    });

    it('should return the parser instance', () => {
      expect(parser.verify()).toBe(parser);
    });
  });

  // describe('getTrees', ()=> {});

  describe('Build original template from tokens', () => {
    test('should build the original template from tokens', () => {
      let template = 'Hello {{.name}}';
      let parser = new Parser('my template', template);
      parser.tokenize();
      parser.verify();
      let builtTemplate = parser.tokens
        .map((token) => token.originalText)
        .join('');
      expect(builtTemplate).toBe(template);
    });
  });
});

describe('Parser errors', () => {
  test.each([
    // /* Working tests
    ['unclosed1', 'line1\n{{', ['unclosed1:2: unclosed action']],
    [
      'unclosed2',
      'line1\n{{define `x`}}line2\n{{',
      ['unclosed2:3: unclosed action'],
    ],
    [
      'unclosed3',
      'line1\n{{"x"\n"y"\n',
      ['unclosed3:4: unclosed action started at unclosed3:2'],
    ],
    [
      'unclosed4',
      '{{\n\n\n\n\n',
      ['unclosed4:6: unclosed action started at unclosed4:1'],
    ],
    [
      'unclosed5',
      '{{if .}}\nDot is true\n{{else}}\nline1 {{"x" "y"\n{{end}}',
      ['unclosed5:5: unclosed action started at unclosed5:4'],
      true,
    ],
    ['var1', 'line1\n{{\nx\n}}', ['var1:3: function "x" not defined']],
    ['function', '{{foo}}', ['function "foo" not defined']],
    ['comment1', '{{/*}}', ['comment1:1: unclosed comment']],
    ['comment2', '{{/*\nhello\n}}', ['comment2:1: unclosed comment']],
    ['lparen', '{{.X (1 2 3}}', ['unclosed left paren']],
    ['rparen', '{{.X 1 2 3 ) }}', ['unexpected right paren']],
    ['rparen2', '{{(.X 1 2 3', ['unclosed action']],
    ['charconst', "{{'a}}", ['unterminated character constant']],
    ['stringconst', '{{"a}}', ['unterminated quoted string']],
    ['rawstringconst', '{{`a}}', ['unterminated raw quoted string']],
    ['number', '{{0xi}}', ['number syntax']],
    [
      'multilinerawstring',
      '{{ $v := `\n` }} {{',
      ['multilinerawstring:2: unclosed action'],
    ],
    [
      'emptypipeline',
      `{{ ( ) }}`,
      ['missing value for parenthesized pipeline'],
    ],
    ['eof', '{{range .X}}', ['unexpected EOF']],
    [
      'unexpected1',
      '{{if .}}\nDot is true\n{{end}}\n{{else}}\nDot is not true\n{{end}}',
      [
        'unexpected1:4: unexpected {{else}}',
        'unexpected1:6: unexpected {{end}}',
      ],
      true,
    ],
    [
      'unexpectedEnd1',
      '{{if .}}\nDot is true\n{{else}}\n{{else}}\nDot is not true\n{{end}}',
      ['unexpectedEnd1:4: expected end; found {{else}}'],
      true,
    ],
    [
      'unexpectedFlow1',
      '{{if .}}\nDot is true\n{{else}}\n{{continue}}\nDot is not true\n{{end}}',
      ['unexpectedFlow1:4: {{continue}} outside {{range}}'],
      true,
    ],
    [
      'unexpectedFlow2',
      '{{range .}}\nDot is true\n{{else}}\n{{break}}\nDot is not true\n{{end}}',
      ['unexpectedFlow2:4: {{break}} outside {{range}}'],
      true,
    ],
    [
      'unexpectedTokenIn1',
      '{{range .}}\nDot is true\n{{else .}}\nDot is not true\n{{end}}',
      ['unexpectedTokenIn1:3: unexpected <.> in else'],
      true,
    ],
    [
      'unexpectedTokenIn2',
      '{{range .}}\nDot is true\n{{else if .}}\nDot is not true\n{{end}}',
      ['unexpectedTokenIn2:3: unexpected <if> in else'],
      true,
    ],
    [
      'unexpectedTokenIn3',
      '{{if .}}\nDot is true\n{{else with}}\n{{else}}\nDot is not true\n{{end}}',
      ['unexpectedTokenIn3:3: unexpected <with> in else'],
      true,
    ],
    [
      'unexpectedTokenIn4',
      '{{range .}}\nDot is true\n{{else range .}}\nDot is not true\n{{end}}',
      ['unexpectedTokenIn4:3: unexpected <range> in else'],
      true,
    ],
    [
      'unexpectedTokenIn6',
      '{{range .}}\nLine 1\n{{break .}}\nShould not print\n{{end}}',
      ['unexpectedTokenIn6:3: unexpected <.> in break'],
      true,
    ],
    [
      'unexpectedTokenIn7',
      '{{block "list" .}}{{"\n"}}{{range .}}{{println "-" .}}{{end}}{{define "list2"}} {{join . ", "}}{{end}}{{end}}',
      ['unexpectedTokenIn7:2: unexpected <define> in command'],
    ],
    [
      'unexpectedTokenIn8',
      '{{block .list .data}}{{range .}}{{println "-" .}}{{end}}{{end}}',
      ['unexpectedTokenIn8:1: unexpected ".list" in block clause'],
      true,
    ],
    [
      'multidefine1',
      '{{define `a`}}a{{end}}{{define `a`}}b{{end}}',
      ['multidefine1:1: template: multiple definition of template "a"'],
    ],
    [
      'multidefine2',
      '{{define `multidefine2`}}a{{end}}',
      [
        'multidefine2:1: template: multiple definition of template "multidefine2"',
      ],
    ],
    /* */
    // ['variable', '{{$x := 23}}{{with $x.y := 3}}{{$x 23}}{{end}}', ['unexpected ":="']],
    // ['assign', '{{$.prop = 'value'}}', ['unexpected "=" in operand']],
    // ['multidecl', '{{$a,$b,$c := 23}}', ['too many declarations']],
    // ['undefvar', '{{$a}}', ['undefined variable']],
    // ['wrongdot', '{{true.any}}', ['unexpected . after term']],
    // ['wrongpipeline', '{{12|false}}', ['non executable command in pipeline']],
    // ['rangeundefvar', '{{range $k}}{{end}}', ['undefined variable']],
    // ['rangeundefvars', '{{range $k, $v}}{{end}}', ['undefined variable']],
    // ['rangemissingvalue1', '{{range $k, }}{{end}}', ['missing value for range']],
    // ['rangemissingvalue2', '{{range $k, $v := }}{{end}}', ['missing value for range']],
    // ['rangenotvariable1', '{{range $k, .}}{{end}}', ['range can only initialize variables']],
    // ['rangenotvariable2', '{{range $k, 123 := .}}{{end}}', ['range can only initialize variables']],
    // ['space', '{{`x`3}}', ['in operand']],
    // ['idchar', '{{a#}}', ["'#'"]],
  ])('%s should have error', (name, text, error, exact = false) => {
    // console.log('test', name);
    let parser = new Parser(name, text);
    parser.tokenize();
    expect(() => parser.verify()).toThrow();

    if (exact) {
      expect(parser.errors).toEqual(error);
    } else {
      expect(parser.errors).toContain(...error);
    }
  });
});
