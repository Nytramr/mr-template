import { SEPARATOR_REG_EX } from './split';
import { splitTextToMatches } from './utils';

describe('Token Utils', () => {
  describe('splitTextToMatches', () => {
    describe('Split template with SEPARATOR_REG_EX_GROUP', () => {
      it('should return a single slice when no actions', () => {
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

        const result = Array.from(
          splitTextToMatches(templateTpl, SEPARATOR_REG_EX),
        );

        expect(result).toHaveLength(1);
        expect(result).toEqual([
          {
            _unknown: {
              start: 0,
              end: templateTpl.length,
              text: templateTpl,
            },
          },
        ]);
      });

      test('Template with unclosed actions', () => {
        const templateTpl =
          '{{if .}}\n{{Dot is true\n{{else}}\nline1 {{"x" "y"\n{{end}}';
        // |''''|''' '|''''|''''|'' ''|''''|' '''|''''|''''|'' ''|''''|'
        // 0    5     10   15   20    25   30    35   40   45    50   55
        const result = Array.from(
          splitTextToMatches(templateTpl, SEPARATOR_REG_EX),
        );

        expect(result).toEqual([
          {
            _originalText: '{{if .}}',
            action: {
              end: 6,
              start: 2,
              text: 'if .',
            },
          },
          {
            _unknown: {
              start: 8,
              end: 23,
              text: '\n{{Dot is true\n',
            },
          },
          {
            _originalText: '{{else}}',
            action: {
              end: 29,
              start: 25,
              text: 'else',
            },
          },
          {
            _unknown: {
              start: 31,
              end: 48,
              text: '\nline1 {{"x" "y"\n',
            },
          },
          {
            _originalText: '{{end}}',
            action: {
              end: 53,
              start: 50,
              text: 'end',
            },
          },
        ]);
      });
    });
  });
});
