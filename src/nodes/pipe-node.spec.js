import { PipelineNode } from './pipe-node';
import { createDummyNode } from './test-utils';

describe('PipelineNode', () => {
  describe('isEmpty', () => {
    const emptyNode = createDummyNode();
    const nonEmptyNode = createDummyNode();

    beforeEach(() => {
      emptyNode.isEmpty.mockReturnValue(true);
      nonEmptyNode.isEmpty.mockReturnValue(false);
    });

    it('should return true when every node is empty', () => {
      const nodeEntity = new PipelineNode([emptyNode, emptyNode, emptyNode]);

      expect(nodeEntity.isEmpty()).toBe(true);
    });
    
    it('should return false when any node is not empty', () => {
      const nodeEntity = new PipelineNode([emptyNode, nonEmptyNode, emptyNode]);

      expect(nodeEntity.isEmpty()).toBe(false);
    });
  });
});
