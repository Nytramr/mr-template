import { BaseNode } from './base-node';

export class Conditional extends BaseNode {
  #conditionNode;
  #elseNode;
  #nextNode;

  constructor(condition, nextNode, elseNode = '', token) {
    super(token);
    this.#conditionNode = condition;
    this.#nextNode = nextNode;
    this.#elseNode = elseNode;
  }

  execute(data, runningScope) {
    return this.#conditionNode.execute(data, runningScope)
      ? this.#nextNode.execute(data, runningScope)
      : this.#elseNode && this.#elseNode.execute(data, runningScope);
  }

  isEmpty() {
    return (
      this.#nextNode.isEmpty() && (!this.#elseNode || this.#elseNode.isEmpty())
    );
  }

  toJSON() {
    return {
      node: 'Conditional',
      condition: this.#conditionNode,
      nextNode: this.#nextNode,
      elseNode: this.#elseNode,
    };
  }
}
