import { Constant } from '../nodes/constant-node';
import { executeOperator } from './test-utils';
import { len, index, slice } from './collections';

const emptyStringConstant = new Constant('');
const emptyArrayConstant = new Constant([]);
const emptyObjectConstant = new Constant({});
const stringConstant = new Constant('Hello world!');
const arrayConstant = new Constant(['a', 'b', 'c', 'd', 'e', 'f']);
const objectConstant = new Constant({
  key1: 'value 1',
  key2: 'value 2',
  key3: 'value 3',
  key4: 'value 4',
  length: 7,
});

const numberConstant = new Constant(123);
const nilConstant = new Constant(null);

const index0 = new Constant(0);
const index1 = new Constant(1);
const index2 = new Constant(2);
const index3 = new Constant(3);
const index4 = new Constant(4);
const index5 = new Constant(5);
const indexN1 = new Constant(-1);
const indexN2 = new Constant(-2);

describe('collections', () => {
  describe('len', () => {
    it('should return a function', () => {
      expect(len(arrayConstant)).toBeInstanceOf(Function);
    });

    it.each`
      collection             | length
      ${arrayConstant}       | ${6}
      ${stringConstant}      | ${12}
      ${objectConstant}      | ${5}
      ${emptyArrayConstant}  | ${0}
      ${emptyStringConstant} | ${0}
      ${emptyObjectConstant} | ${0}
      ${numberConstant}      | ${0}
      ${nilConstant}         | ${0}
    `(
      'should return the length of the collection',
      ({ collection, length }) => {
        const lenNode = len(collection);

        expect(lenNode({})).toBe(length);
      },
    );

    it('should include piped arg', () => {
      const string = 'string collection';
      const fn = len();
      expect(executeOperator(fn, string)).toBe(string.length);
      expect(executeOperator(fn, true)).toBe(0);
    });
  });

  describe('index', () => {
    const multiArrayConstant = new Constant([
      ['a'],
      ['b', 'c'],
      ['d', ['e'], 'f'],
      'g',
    ]);

    it('should return a function', () => {
      expect(index(arrayConstant)).toBeInstanceOf(Function);
    });

    it.each`
      args                        | result
      ${[index3]}                 | ${'g'}
      ${[index0, index0]}         | ${'a'}
      ${[index2, index1, index0]} | ${'e'}
      ${[indexN1]}                | ${'g'}
      ${[indexN2, indexN1]}       | ${'f'}
      ${[index4]}                 | ${null}
    `(
      'should return the element of the collection point by the indexes ($result)',
      ({ args, result }) => {
        const indexNode = index(multiArrayConstant, ...args);

        expect(indexNode({})).toBe(result);
      },
    );

    it('should include piped arg', () => {
      const fn = index(arrayConstant);
      expect(executeOperator(fn, 1)).toBe('b');
      expect(executeOperator(fn, 8)).toBe(null);
    });
  });

  describe('slice', () => {
    it('should return a function', () => {
      expect(slice(arrayConstant)).toBeInstanceOf(Function);
    });

    it.each`
      collection             | args                     | result
      ${arrayConstant}       | ${[]}                    | ${['a', 'b', 'c', 'd', 'e', 'f']}
      ${arrayConstant}       | ${[index2]}              | ${['c', 'd', 'e', 'f']}
      ${arrayConstant}       | ${[index1, index4]}      | ${['b', 'c', 'd']}
      ${arrayConstant}       | ${[nilConstant, index3]} | ${['a', 'b', 'c']}
      ${stringConstant}      | ${[]}                    | ${'Hello world!'}
      ${stringConstant}      | ${[index4]}              | ${'o world!'}
      ${stringConstant}      | ${[index2, index5]}      | ${'llo'}
      ${stringConstant}      | ${[nilConstant, index5]} | ${'Hello'}
      ${emptyArrayConstant}  | ${[index1, index3]}      | ${[]}
      ${emptyStringConstant} | ${[index1, index3]}      | ${[]}
    `(
      'should return a fraction of the collection',
      ({ collection, args, result }) => {
        const sliceNode = slice(collection, ...args);

        expect(sliceNode({})).toEqual(result);
      },
    );

    it.each`
      args                     | piped | result
      ${[]}                    | ${5}  | ${['f']}
      ${[nilConstant]}         | ${3}  | ${['a', 'b', 'c']}
      ${[index2, nilConstant]} | ${7}  | ${['c', 'd', 'e', 'f']}
    `('should include piped arg', ({ args, piped, result }) => {
      const fn = slice(arrayConstant, ...args);
      expect(executeOperator(fn, piped)).toEqual(result);
    });
  });
});
