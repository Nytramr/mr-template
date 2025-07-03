import { BREAK_ACTION, CONTINUE_ACTION } from '../constants';
import { createDummyNode, interruptionNode } from './test-utils';
import { Sequence } from './sequence-node';

describe('Sequence Node', () => {
  const step1 = createDummyNode();
  const step2 = createDummyNode();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSequence', () => {
    it('should return a Sequence', () => {
      expect(Sequence.getSequence([])).toBeInstanceOf(Sequence);
      expect(Sequence.getSequence([step1, step2])).toBeInstanceOf(Sequence);
    });

    test('with a single step, it returns that step', () => {
      expect(Sequence.getSequence([step1])).toBe(step1);
    });
  });

  describe('execution', () => {
    const dot = 'data';
    const data = [dot];

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
      [CONTINUE_ACTION]: expect.any(Function),
    };

    test('every node in the sequence should be called with the data and running scopes', () => {
      const sequenceNode = new Sequence([step1, step2]);
      sequenceNode.execute(data, runningScope);

      expect(breakAction).not.toHaveBeenCalled();
      expect(continueAction).not.toHaveBeenCalled();

      expect(step1.execute).toHaveBeenCalledWith(data, [
        localScopeAssert,
        ...runningScope,
      ]);
      expect(step2.execute).toHaveBeenCalledWith(data, [
        localScopeAssert,
        ...runningScope,
      ]);
    });

    test('empty sequence returns an empty string', () => {
      const sequenceNode = new Sequence([]);
      const result = sequenceNode.execute([{}], []);

      expect(result).toBe('');
    });

    it('returns the join of the node results', () => {
      const step1 = createDummyNode('Hello');
      const step2 = createDummyNode(' ');
      const step3 = createDummyNode('world!');

      const sequenceNode = new Sequence([step1, step2, step3]);
      const result = sequenceNode.execute([], []);

      expect(result).toBe('Hello world!');
    });

    describe('break interruption', () => {
      const breakStep = interruptionNode(BREAK_ACTION);
      const sequenceNode = new Sequence([step1, breakStep, step2]);

      it('should stop the sequence', () => {
        sequenceNode.execute(data, runningScope);

        expect(step1.execute).toHaveBeenCalled();
        expect(breakStep.execute).toHaveBeenCalled();
        expect(step2.execute).not.toHaveBeenCalled();
      });

      it('should call parent running scope interruption', () => {
        sequenceNode.execute(data, runningScope);

        expect(breakAction).toHaveBeenCalled();
      });
    });

    describe('continue interruption', () => {
      const continueStep = interruptionNode(CONTINUE_ACTION);
      const sequenceNode = new Sequence([step1, continueStep, step2]);

      it('should stop the sequence', () => {
        sequenceNode.execute(data, runningScope);

        expect(step1.execute).toHaveBeenCalled();
        expect(continueStep.execute).toHaveBeenCalled();
        expect(step2.execute).not.toHaveBeenCalled();
      });

      it('should call parent running scope interruption', () => {
        sequenceNode.execute(data, runningScope);

        expect(continueAction).toHaveBeenCalled();
      });
    });
  });

  describe('isEmpty', () => {
    const emptyNode = createDummyNode();
    const nonEmptyNode = createDummyNode();

    beforeEach(() => {
      emptyNode.isEmpty.mockReturnValue(true);
      nonEmptyNode.isEmpty.mockReturnValue(false);
    });

    it('should return true when every node is empty', () => {
      const nodeEntity = new Sequence([emptyNode, emptyNode, emptyNode]);

      expect(nodeEntity.isEmpty()).toBe(true);
    });

    it('should return false when any node is not empty', () => {
      const nodeEntity = new Sequence([emptyNode, nonEmptyNode, emptyNode]);

      expect(nodeEntity.isEmpty()).toBe(false);
    });
  });
});
