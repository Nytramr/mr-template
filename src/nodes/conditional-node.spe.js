// import { conditionalAction } from './action-node';

describe('Action Nodes', () => {
  describe('Conditional Action', () => {
    const pipelineNode = jest.fn();
    const nextNode = jest.fn();
    const elseNode = jest.fn();

    const nextResult = 'NEXT_RESULT';
    const elseResult = 'ELSE_RESULT';

    const action = conditionalAction(pipelineNode, nextNode, elseNode);

    beforeEach(() => {
      nextNode.mockReturnValue(nextResult);
      elseNode.mockReturnValue(elseResult);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return a function', () => {
      expect(
        conditionalAction(pipelineNode, nextNode, elseNode),
      ).toBeInstanceOf(Function);
    });

    describe('Execution', () => {
      test('when pipelineNode returns true, execute nextNode', () => {
        const data = {};
        pipelineNode.mockReturnValue(true);
        const result = action(data);
        expect(nextNode).toHaveBeenCalledTimes(1);
        expect(elseNode).not.toHaveBeenCalled();
        expect(nextNode).toHaveBeenCalledWith(data);
        expect(result).toBe(nextResult);
      });

      test('when pipelineNode returns false, execute elseNode', () => {
        const data = {};
        pipelineNode.mockReturnValue(false);
        const result = action(data);
        expect(elseNode).toHaveBeenCalledTimes(1);
        expect(nextNode).not.toHaveBeenCalled();
        expect(elseNode).toHaveBeenCalledWith(data);
        expect(result).toBe(elseResult);
      });

      describe('No else', () => {
        const action = conditionalAction(pipelineNode, nextNode);

        it('should not throw', () => {
          const data = {};
          pipelineNode.mockReturnValue(true);
          expect(action).not.toThrow();
          pipelineNode.mockReturnValue(false);
          expect(action).not.toThrow();
        });

        test('when pipelineNode returns false, returns empty string', () => {
          const data = {};
          pipelineNode.mockReturnValue(false);
          const result = action(data);
          expect(result).toBe('');
        });
      });
    });
  });
});
