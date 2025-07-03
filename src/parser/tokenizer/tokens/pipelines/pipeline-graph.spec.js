import { processPipelineParts } from './pipeline-graph';

function strToTokenArray(...strings) {
  return strings.map((str) => ({ text: str }));
}

function pipeToStr(pipe) {
  return pipe.map((part) => {
    if (Array.isArray(part)) {
      return pipeToStr(part);
    }

    return part.text;
  });
}

describe('processPipelineParts', () => {
  test('handles empty input array', () => {
    const result = processPipelineParts([]);
    expect(pipeToStr(result)).toEqual([]);
  });

  test('handles undefined input', () => {
    const result = processPipelineParts();
    expect(pipeToStr(result)).toEqual([]);
  });

  test('handles single command with no pipe', () => {
    const input = strToTokenArray('command1', 'arg1', 'arg2');
    const result = processPipelineParts(input);
    expect(pipeToStr(result)).toEqual([['command1', 'arg1', 'arg2']]);
  });

  describe('pipes', () => {
    test('groups simple pipeline parts correctly', () => {
      const input = strToTokenArray(
        'command1',
        'arg1',
        '|',
        'command2',
        'arg2',
      );
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([
        ['command1', 'arg1'],
        '|',
        ['command2', 'arg2'],
      ]);
    });

    test('handles multiple pipes', () => {
      const input = strToTokenArray(
        'cmd1',
        'arg1',
        '|',
        'cmd2',
        '|',
        'cmd3',
        'arg3',
      );
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([
        ['cmd1', 'arg1'],
        '|',
        ['cmd2'],
        '|',
        ['cmd3', 'arg3'],
      ]);
    });

    test('handles empty parts', () => {
      const input = strToTokenArray('cmd1', '', '|', '', 'cmd2');
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([['cmd1'], '|', ['cmd2']]);
    });
  });

  describe('parens', () => {
    test('groups simple parens correctly', () => {
      const input = strToTokenArray(
        'command1',
        'arg1',
        '(',
        'command2',
        'arg2',
        ')',
        'command3',
      );
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([
        ['command1', 'arg1', ['(', ['command2', 'arg2'], ')'], 'command3'],
      ]);
    });

    test('handles multiple parens', () => {
      const input = strToTokenArray(
        'cmd1',
        'arg1',
        '(',
        'cmd2',
        'arg2',
        ')',
        '(',
        'cmd3',
        'arg3',
        ')',
      );
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([
        [
          'cmd1',
          'arg1',
          ['(', ['cmd2', 'arg2'], ')'],
          ['(', ['cmd3', 'arg3'], ')'],
        ],
      ]);
    });

    test('handles nested parens', () => {
      const input = strToTokenArray(
        'cmd1',
        '(',
        'cmd2',
        'arg2',
        '(',
        'cmd3',
        'arg3',
        ')',
        ')',
        '(',
        'cmd4',
        'arg4',
        ')',
      );
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([
        [
          'cmd1',
          ['(', ['cmd2', 'arg2', ['(', ['cmd3', 'arg3'], ')']], ')'],
          ['(', ['cmd4', 'arg4'], ')'],
        ],
      ]);
    });
  });

  describe('assignations', () => {
    test('groups simple assignation correctly', () => {
      const input = strToTokenArray('var1', '=', 'arg1');
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([['=', ['var1'], [['arg1']]]]);
    });

    test('groups assignation with pipe', () => {
      const input = strToTokenArray('var1', '=', 'arg1', '|', 'cmd2', 'arg2');
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([
        ['=', ['var1'], [['arg1'], '|', ['cmd2', 'arg2']]],
      ]);
    });

    test('groups assignation with parens', () => {
      const input = strToTokenArray(
        'var1',
        '=',
        'cmd1',
        '(',
        'cmd2',
        'arg2',
        ')',
        'arg3',
      );
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([
        ['=', ['var1'], [['cmd1', ['(', ['cmd2', 'arg2'], ')'], 'arg3']]],
      ]);
    });

    test('groups multiple assignation', () => {
      const input = strToTokenArray('var1', ',', 'var2', '=', 'arg1');
      const result = processPipelineParts(input);
      expect(pipeToStr(result)).toEqual([
        ['=', ['var1', ',', 'var2'], [['arg1']]],
      ]);
    });
  });
});
