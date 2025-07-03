import { BREAK_ACTION, CONTINUE_ACTION } from '../constants';
import { createDummyNode, valueFromKey } from './test-utils';
import { Constant } from './constant-node';
import { RangeLoop } from './loop-node';

describe('RangeLoop Node', () => {
  let scope = {};
  let data = [scope];

  let breakAction = jest.fn();
  let continueAction = jest.fn();
  let parentScope1 = {
    [BREAK_ACTION]: breakAction,
    [CONTINUE_ACTION]: continueAction,
  };
  let parentScope2 = {};
  let runningScope = [parentScope2, parentScope1];

  let localScopeAssert = {
    [BREAK_ACTION]: expect.any(Function),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execution', () => {
    describe('with a range', () => {
      test.each`
        type        | range
        ${'Array'}  | ${['0', '1', '2', '3', '4', '5']}
        ${'Object'} | ${{ a: '0', b: '1', c: '2', d: '3', e: '4', f: '5' }}
        ${'Number'} | ${6}
        ${'String'} | ${'012345'}
      `('loop through the $type', ({ range }) => {
        let valuePipeline = new Constant(range);
        let nextBlock = valueFromKey('');
        let elseBlock = { execute: jest.fn() };

        let loop = new RangeLoop(valuePipeline, nextBlock, elseBlock);

        expect(elseBlock.execute).not.toHaveBeenCalled();
        expect(loop.execute()).toBe('012345');
      });

      test.each([
        [[3]],
        [[1, 2, 3]],
        [[3, 4, 5]],
        [[1, 2, 3, 4, 5]],
        [['a', '2', [], 7]],
      ])('loop through every element', (range) => {
        let valuePipeline = new Constant(range);
        let nextBlock = { execute: jest.fn() };
        let loop = new RangeLoop(valuePipeline, nextBlock);

        loop.execute(data, runningScope);

        expect(nextBlock.execute).toHaveBeenCalledTimes(range.length);

        range.forEach((element, i) => {
          expect(nextBlock.execute).toHaveBeenNthCalledWith(
            i + 1,
            [element, scope],
            [localScopeAssert, ...runningScope],
          );
        });
      });

      describe('break interruption', () => {
        const nextBlock = createDummyNode('value');
        nextBlock.execute.mockImplementation(([index], [scope]) => {
          if (index == 4) {
            scope[BREAK_ACTION]();
          }
        });
        const getter = valueFromKey('');
        const loop = new RangeLoop(getter, nextBlock);

        it('should stop execution when break is called', () => {
          loop.execute([8], runningScope);
          expect(nextBlock.execute).toHaveBeenCalledTimes(5);
        });

        it('should not call parent scope interruptions', () => {
          loop.execute([8], runningScope);
          expect(breakAction).not.toHaveBeenCalled();
        });
      });
    });

    describe('empty range', () => {
      it('should execute the else block with unmodified scope', () => {
        let valuePipeline = new Constant([]);
        let nextBlock = { execute: jest.fn() };
        let elseBlock = { execute: jest.fn() };
        let loop = new RangeLoop(valuePipeline, nextBlock, elseBlock);

        loop.execute(data, runningScope);

        expect(elseBlock.execute).toHaveBeenCalledTimes(1);
        expect(elseBlock.execute).toHaveBeenCalledWith(data, runningScope);
      });

      test.each([[''], [[]], [0], [true], [null], [{}], [-2]])(
        'empty range value must run the else block',
        (range) => {
          let valuePipeline = new Constant(range);
          let nextBlock = { execute: jest.fn() };
          let elseBlock = { execute: jest.fn() };

          let loop = new RangeLoop(valuePipeline, nextBlock, elseBlock);

          loop.execute();

          expect(elseBlock.execute).toHaveBeenCalled();
          expect(nextBlock.execute).not.toHaveBeenCalled();
        },
      );
    });
  });

  describe('isEmpty', () => {
    const nextNode = createDummyNode();
    const elseNode = createDummyNode();
    const selector = createDummyNode('selector');

    it.each`
      nextValue | elseValue | resultValue
      ${false}  | ${false}  | ${false}
      ${false}  | ${true}   | ${false}
      ${true}   | ${false}  | ${false}
      ${true}   | ${true}   | ${true}
    `(
      'should return $resultValue when next is $nextValue and else is $elseValue',
      ({ nextValue, elseValue, resultValue }) => {
        const nodeEntity = new RangeLoop(selector, nextNode, elseNode);
        nextNode.isEmpty.mockReturnValue(nextValue);
        elseNode.isEmpty.mockReturnValue(elseValue);

        expect(nodeEntity.isEmpty()).toBe(resultValue);
      },
    );

    it.each`
      nextValue | resultValue
      ${false}  | ${false}
      ${true}   | ${true}
    `(
      'should return $resultValue when next is $nextValue and else is undefined',
      ({ nextValue, resultValue }) => {
        const nodeEntity = new RangeLoop(selector, nextNode);
        nextNode.isEmpty.mockReturnValue(nextValue);

        expect(nodeEntity.isEmpty()).toBe(resultValue);
      },
    );
  });
});
