import { Constant } from '../nodes';
import { executeOperator } from './test-utils';
import { printf, print } from './print';

const helloNode = new Constant('Hello');
const worldNode = new Constant('world');

describe('print', () => {
  it('should return a function', () => {
    expect(print()).toBeInstanceOf(Function);
  });

  test('should include piped arg', () => {
    const fn = print(helloNode);
    expect(executeOperator(fn, '!')).toBe('Hello!');
  });

  it.each`
    args                                          | expected
    ${[]}                                         | ${''}
    ${[helloNode]}                                | ${'Hello'}
    ${[helloNode, worldNode]}                     | ${'Helloworld'}
    ${[new Constant('Hello, '), worldNode]}       | ${'Hello, world'}
    ${[helloNode, new Constant(', '), worldNode]} | ${'Hello, world'}
    ${[helloNode, worldNode, new Constant(3)]}    | ${'Hello world 3'}
  `('should print $expected', ({ args, expected }) => {
    const fn = print(...args);
    expect(executeOperator(fn)).toBe(expected);
  });
});

describe('printf', () => {
  it('should return a function', () => {
    expect(printf('Hello, world!')).toBeInstanceOf(Function);
  });

  test('should include piped arg', () => {
    const format = new Constant('Hello, %s!');
    const fn = printf(format);
    expect(executeOperator(fn, 'world')).toBe('Hello, world!');
  });

  describe('Format string', () => {
    describe('escaping', () => {
      const word = new Constant('word');
      test.each`
        formatText  | expected
        ${'%%'}     | ${'%'}
        ${'%%s'}    | ${'%s'}
        ${'%% s'}   | ${'% s'}
        ${'100%%'}  | ${'100%'}
        ${'100%%s'} | ${'100%s'}
      `('% should be escaped in $formatText', ({ formatText, expected }) => {
        const format = new Constant(formatText);
        const fn = printf(format);
        expect(executeOperator(fn)).toBe(expected);
      });

      test.each`
        formatText     | expected
        ${'%s%%'}      | ${'word%'}
        ${'%%s to %s'} | ${'%s to word'}
        ${'100%% %s'}  | ${'100% word'}
        ${'100%% %ss'} | ${'100% words'}
      `(
        '% should be escaped in combined format strings $formatText',
        ({ formatText, expected }) => {
          const format = new Constant(formatText);
          const fn = printf(format, word);
          expect(executeOperator(fn)).toBe(expected);
        },
      );
    });

    describe('strings verbs', () => {
      it.each`
        formatText         | args                      | expected
        ${'Hello, world!'} | ${[]}                     | ${'Hello, world!'}
        ${'Hello, %s!'}    | ${[worldNode]}            | ${'Hello, world!'}
        ${'%s, world!'}    | ${[helloNode]}            | ${'Hello, world!'}
        ${'%s, %s!'}       | ${[helloNode, worldNode]} | ${'Hello, world!'}
      `(
        'should $formatText with $args return a $expected',
        ({ formatText, args, expected }) => {
          const format = new Constant(formatText);
          const fn = printf(format, ...args);
          expect(executeOperator(fn)).toBe(expected);
        },
      );
    });
  });
});
