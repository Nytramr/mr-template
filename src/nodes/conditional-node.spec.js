import { Conditional } from './conditional-node';
import { createDummyNode } from './test-utils';

describe('Conditional', () => {
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
        const nodeEntity = new Conditional(selector, nextNode, elseNode);
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
        const nodeEntity = new Conditional(selector, nextNode);
        nextNode.isEmpty.mockReturnValue(nextValue);

        expect(nodeEntity.isEmpty()).toBe(resultValue);
      },
    );
  });
});
