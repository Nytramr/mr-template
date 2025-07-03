import { Constant } from '../nodes/constant-node';
import { valueFromKey } from '../nodes/test-utils';
import { executeOperator, operatorToNode } from './test-utils';
import { or, and, not } from './bool-logic';

const trueNode = new Constant(true);
const falseNode = new Constant(false);

describe('or', () => {
  it('should return a function', () => {
    expect(or(trueNode, falseNode)).toBeInstanceOf(Function);
  });

  it('should handle piped argument', () => {
    const orOperator = or(trueNode);
    expect(executeOperator(orOperator, true)).toBe(true);
    expect(executeOperator(orOperator, false)).toBe(true);
  });

  describe('execution', () => {
    it.each`
      a            | b            | expected
      ${trueNode}  | ${trueNode}  | ${true}
      ${trueNode}  | ${falseNode} | ${true}
      ${falseNode} | ${trueNode}  | ${true}
      ${falseNode} | ${falseNode} | ${false}
    `('should return $expected for or($a, $b)', ({ a, b, expected }) => {
      const orOperator = or(a, b);
      expect(executeOperator(orOperator)).toBe(expected);
    });

    it('should work with dynamic values', () => {
      const data = [{ x: true, y: false }];
      const xNode = valueFromKey('x');
      const yNode = valueFromKey('y');

      expect(or(xNode, yNode)(data)).toBe(true);

      const newData = [{ x: false, y: false }];
      expect(or(xNode, yNode)(newData)).toBe(false);
    });

    it('should throw an error when called with the wrong number of arguments', () => {
      // Testing internal behavior of pipedNodeFactory function when evaluated
      const orOperator = or(trueNode, falseNode, new Constant(true));
      expect(() => executeOperator(orOperator)).toThrow(
        'or expects 2 arguments',
      );
    });
  });
});

describe('and', () => {
  it('should return a function', () => {
    expect(and(trueNode, falseNode)).toBeInstanceOf(Function);
  });

  it('should handle piped argument', () => {
    const andOperator = and(trueNode);
    expect(executeOperator(andOperator, true)).toBe(true);
    expect(executeOperator(andOperator, false)).toBe(false);
  });

  describe('execution', () => {
    it.each`
      a            | b            | expected
      ${trueNode}  | ${trueNode}  | ${true}
      ${trueNode}  | ${falseNode} | ${false}
      ${falseNode} | ${trueNode}  | ${false}
      ${falseNode} | ${falseNode} | ${false}
    `('should return $expected for and($a, $b)', ({ a, b, expected }) => {
      const andOperator = and(a, b);
      expect(executeOperator(andOperator)).toBe(expected);
    });

    it('should work with dynamic values', () => {
      const data = [{ x: true, y: true }];
      const xNode = valueFromKey('x');
      const yNode = valueFromKey('y');

      expect(and(xNode, yNode)(data)).toBe(true);

      const newData = [{ x: true, y: false }];
      expect(and(xNode, yNode)(newData)).toBe(false);
    });

    it('should throw an error when called with the wrong number of arguments', () => {
      const andOperator = and(trueNode, falseNode, new Constant(true));
      expect(() => executeOperator(andOperator)).toThrow(
        'and expects 2 arguments',
      );
    });
  });
});

describe('not', () => {
  it('should return a function', () => {
    expect(not(trueNode)).toBeInstanceOf(Function);
  });

  it('should handle piped argument', () => {
    const notOperator = not();
    expect(executeOperator(notOperator, true)).toBe(false);
    expect(executeOperator(notOperator, false)).toBe(true);
  });

  describe('execution', () => {
    it.each`
      a            | expected
      ${trueNode}  | ${false}
      ${falseNode} | ${true}
    `('should return $expected for not($a)', ({ a, expected }) => {
      const notOperator = not(a);
      expect(executeOperator(notOperator)).toBe(expected);
    });

    it('should work with dynamic values', () => {
      const data = [{ x: true }];
      const xNode = valueFromKey('x');

      expect(not(xNode)(data)).toBe(false);

      const newData = [{ x: false }];
      expect(not(xNode)(newData)).toBe(true);
    });

    it('should throw an error when called with the wrong number of arguments', () => {
      const notOperator = not(trueNode, falseNode);
      expect(() => executeOperator(notOperator)).toThrow(
        'not expects 1 argument',
      );
    });
  });
});

describe('composition', () => {
  it('should allow chaining logical operations', () => {
    const data = [{ x: true, y: false, z: true }];
    const xNode = valueFromKey('x');
    const yNode = valueFromKey('y');
    const zNode = valueFromKey('z');

    // Test (x OR y) AND z
    const orNode = operatorToNode(or(xNode, yNode));
    const complexOperator = and(orNode, zNode);
    expect(complexOperator(data)).toBe(true);

    // Test NOT (x AND y)
    const andNode = operatorToNode(and(xNode, yNode));
    const notAndOperator = not(andNode);
    expect(notAndOperator(data)).toBe(true);

    // Test (NOT x) OR (NOT y)
    const notXNode = operatorToNode(not(xNode));
    const notYNode = operatorToNode(not(yNode));
    const orNotOperator = or(notXNode, notYNode);
    expect(orNotOperator(data)).toBe(true);
  });
});
