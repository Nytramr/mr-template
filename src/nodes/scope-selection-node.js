import { isEmpty } from '../utils';
import { BaseNode } from './base-node';

export class ScopeSelection extends BaseNode {
  #scopeSelector;
  #elseNode;
  #nextNode;

  constructor(scopeSelector, nextNode, elseNode = '', token) {
    super(token);
    this.#scopeSelector = scopeSelector;
    this.#nextNode = nextNode;
    this.#elseNode = elseNode;
  }

  execute(data = [], runningScope = []) {
    let newRunningScope = {};
    let newDot = this.#scopeSelector.execute(data, [
      newRunningScope,
      ...runningScope,
    ]);
    return isEmpty(newDot) && isEmpty(newRunningScope)
      ? this.#elseNode && this.#elseNode.execute(data, runningScope)
      : this.#nextNode.execute(
          [newDot, ...data],
          [newRunningScope, ...runningScope],
        );
  }

  isEmpty() {
    return (
      this.#nextNode.isEmpty() && (!this.#elseNode || this.#elseNode.isEmpty())
    );
  }

  toJSON() {
    return {
      node: 'ScopeSelection',
      scopeSelector: this.#scopeSelector,
      nextNode: this.#nextNode,
      elseNode: this.#elseNode,
    };
  }
}
