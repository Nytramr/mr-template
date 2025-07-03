import { Constant } from '../nodes/constant-node';
import { valueFromKey } from '../nodes/test-utils';
import { executeOperator } from './test-utils';
import { eq, ge, gt, le, lt, ne } from './binary-comparison';

const aNode = new Constant(1);
const a1Node = new Constant(1);
const a2Node = new Constant(1);
const bNode = new Constant(2);
const zNode = new Constant(0);

describe('binary comparison', () => {
  describe('eq', () => {
    it('should return a function', () => {
      expect(eq(aNode, bNode)).toBeInstanceOf(Function);
    });

    it('should handle piped argument', () => {
      const eqNode = eq(aNode);
      expect(executeOperator(eqNode, 1)).toBe(true);
      expect(executeOperator(eqNode, 2)).toBe(false);
    });

    describe('execution', () => {
      it.each`
        args                       | expected
        ${[aNode, a1Node]}         | ${true}
        ${[aNode, a2Node]}         | ${true}
        ${[aNode, a1Node, a2Node]} | ${true}
        ${[aNode, bNode]}          | ${false}
        ${[aNode, bNode, a2Node]}  | ${false}
        ${[aNode, a1Node, bNode]}  | ${false}
      `('should return $expected for eq($args)', ({ args, expected }) => {
        const eqNode = eq(...args);
        expect(executeOperator(eqNode)).toBe(expected);
      });

      it('should work with dynamic values', () => {
        const data = [{ x: true, y: false }];
        const xNode = valueFromKey('x');
        const yNode = valueFromKey('y');
        const eqNode = eq(xNode, yNode);

        expect(eqNode(data)).toBe(false);

        const newData = [{ x: false, y: false }];
        expect(eqNode(newData)).toBe(true);
      });
    });
  });

  describe('ne', () => {
    it('should return a function', () => {
      expect(ne(aNode, bNode)).toBeInstanceOf(Function);
    });

    it('should handle piped argument', () => {
      const neNode = ne(aNode);
      expect(executeOperator(neNode, 0)).toBe(true);
      expect(executeOperator(neNode, 1)).toBe(false);
    });

    describe('execution', () => {
      it.each`
        args               | expected
        ${[aNode, a1Node]} | ${false}
        ${[aNode, a2Node]} | ${false}
        ${[aNode, bNode]}  | ${true}
        ${[a1Node, bNode]} | ${true}
      `('should return $expected for ne($args)', ({ args, expected }) => {
        const neNode = ne(...args);
        expect(executeOperator(neNode)).toBe(expected);
      });

      it('should work with dynamic values', () => {
        const data = [{ x: false, y: false }];
        const xNode = valueFromKey('x');
        const yNode = valueFromKey('y');
        const neNode = ne(xNode, yNode);

        expect(neNode(data)).toBe(false);

        const newData = [{ x: true, y: false }];
        expect(neNode(newData)).toBe(true);
      });

      it('should throw an error when called with the wrong number of arguments', () => {
        // Testing internal behavior of pipedNodeFactory function when evaluated
        const neNode = ne(aNode, bNode, new Constant(true));
        expect(() => executeOperator(neNode)).toThrow(
          'ne (not equal) expects 2 arguments',
        );
      });
    });
  });

  describe('ge', () => {
    it('should return a function', () => {
      expect(ge(aNode, bNode)).toBeInstanceOf(Function);
    });

    it('should handle piped argument', () => {
      const geNode = ge(aNode);
      expect(executeOperator(geNode, 0)).toBe(true);
      expect(executeOperator(geNode, 1)).toBe(true);
      expect(executeOperator(geNode, 2)).toBe(false);
    });

    describe('execution', () => {
      it.each`
        args               | expected
        ${[bNode, aNode]}  | ${true}
        ${[aNode, zNode]}  | ${true}
        ${[aNode, a1Node]} | ${true}
        ${[aNode, a2Node]} | ${true}
        ${[aNode, bNode]}  | ${false}
        ${[zNode, aNode]}  | ${false}
      `('should return $expected for ge($args)', ({ args, expected }) => {
        const geNode = ge(...args);
        expect(executeOperator(geNode)).toBe(expected);
      });

      it('should work with dynamic values', () => {
        const data = [{ x: 0, y: 2 }];
        const xNode = valueFromKey('x');
        const yNode = valueFromKey('y');
        const geNode = ge(xNode, yNode);

        expect(geNode(data)).toBe(false);

        const data2 = [{ x: 3, y: 1 }];
        expect(geNode(data2)).toBe(true);

        const data3 = [{ x: 3, y: 3 }];
        expect(geNode(data3)).toBe(true);
      });

      it('should throw an error when called with the wrong number of arguments', () => {
        // Testing internal behavior of pipedNodeFactory function when evaluated
        const geNode = ge(aNode, bNode, new Constant(true));
        expect(() => executeOperator(geNode)).toThrow(
          'ge (greater or equal) expects 2 arguments',
        );
      });
    });
  });

  describe('gt', () => {
    it('should return a function', () => {
      expect(gt(aNode, bNode)).toBeInstanceOf(Function);
    });

    it('should handle piped argument', () => {
      const gtNode = gt(aNode);
      expect(executeOperator(gtNode, 0)).toBe(true);
      expect(executeOperator(gtNode, 2)).toBe(false);
    });

    describe('execution', () => {
      it.each`
        args               | expected
        ${[bNode, aNode]}  | ${true}
        ${[aNode, zNode]}  | ${true}
        ${[zNode, aNode]}  | ${false}
        ${[aNode, bNode]}  | ${false}
        ${[aNode, a1Node]} | ${false}
        ${[aNode, a2Node]} | ${false}
      `('should return $expected for gt($args)', ({ args, expected }) => {
        const gtNode = gt(...args);
        expect(executeOperator(gtNode)).toBe(expected);
      });

      it('should work with dynamic values', () => {
        const data = [{ x: 2, y: 4 }];
        const xNode = valueFromKey('x');
        const yNode = valueFromKey('y');
        const gtNode = gt(xNode, yNode);

        expect(gtNode(data)).toBe(false);

        const newData = [{ x: 3, y: 2 }];
        expect(gtNode(newData)).toBe(true);
      });

      it('should throw an error when called with the wrong number of arguments', () => {
        // Testing internal behavior of pipedNodeFactory function when evaluated
        const gtNode = gt(aNode, bNode, new Constant(true));
        expect(() => executeOperator(gtNode)).toThrow(
          'gt (greater than) expects 2 arguments',
        );
      });
    });
  });

  describe('le', () => {
    it('should return a function', () => {
      expect(le(aNode, bNode)).toBeInstanceOf(Function);
    });

    it('should handle piped argument', () => {
      const leNode = le(aNode);
      expect(executeOperator(leNode, 1)).toBe(true);
      expect(executeOperator(leNode, 2)).toBe(true);
      expect(executeOperator(leNode, 0)).toBe(false);
    });

    describe('execution', () => {
      it.each`
        args               | expected
        ${[zNode, aNode]}  | ${true}
        ${[aNode, a1Node]} | ${true}
        ${[aNode, a2Node]} | ${true}
        ${[aNode, bNode]}  | ${true}
        ${[bNode, aNode]}  | ${false}
        ${[aNode, zNode]}  | ${false}
      `('should return $expected for le($args)', ({ args, expected }) => {
        const leNode = le(...args);
        expect(executeOperator(leNode)).toBe(expected);
      });

      it('should work with dynamic values', () => {
        const data = [{ x: 3, y: 2 }];
        const xNode = valueFromKey('x');
        const yNode = valueFromKey('y');
        const leNode = le(xNode, yNode);

        expect(leNode(data)).toBe(false);

        const newData = [{ x: 2, y: 3 }];
        expect(leNode(newData)).toBe(true);
      });

      it('should throw an error when called with the wrong number of arguments', () => {
        // Testing internal behavior of pipedNodeFactory function when evaluated
        const leNode = le(aNode, bNode, new Constant(true));
        expect(() => executeOperator(leNode)).toThrow(
          'le (lower or equal) expects 2 arguments',
        );
      });
    });
  });

  describe('lt', () => {
    it('should return a function', () => {
      expect(lt(aNode, bNode)).toBeInstanceOf(Function);
    });

    it('should handle piped argument', () => {
      const ltNode = lt(aNode);
      expect(executeOperator(ltNode, 2)).toBe(true);
      expect(executeOperator(ltNode, 0)).toBe(false);
    });

    describe('execution', () => {
      it.each`
        args               | expected
        ${[zNode, aNode]}  | ${true}
        ${[aNode, bNode]}  | ${true}
        ${[aNode, a1Node]} | ${false}
        ${[aNode, a2Node]} | ${false}
        ${[bNode, aNode]}  | ${false}
        ${[aNode, zNode]}  | ${false}
      `('should return $expected for lt($args)', ({ args, expected }) => {
        const ltNode = lt(...args);
        expect(executeOperator(ltNode)).toBe(expected);
      });

      it('should work with dynamic values', () => {
        const data = [{ x: 1, y: 0 }];
        const xNode = valueFromKey('x');
        const yNode = valueFromKey('y');
        const ltNode = lt(xNode, yNode);

        expect(ltNode(data)).toBe(false);

        const newData = [{ x: 2, y: 3 }];
        expect(ltNode(newData)).toBe(true);
      });

      it('should throw an error when called with the wrong number of arguments', () => {
        // Testing internal behavior of pipedNodeFactory function when evaluated
        const ltNode = lt(aNode, bNode, new Constant(true));
        expect(() => executeOperator(ltNode)).toThrow(
          'lt (lower than) expects 2 arguments',
        );
      });
    });
  });
});
