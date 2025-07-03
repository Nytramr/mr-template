import { BREAK_ACTION, CONTINUE_ACTION } from '../constants';
import { getScopedValue } from '../utils';
import { BaseNode } from './base-node';

export class Sequence extends BaseNode {
  static getSequence(nodes = [], token) {
    const cleanNodes = nodes.filter(Boolean);

    if (cleanNodes.length === 1) {
      return cleanNodes[0];
    }

    return new Sequence(cleanNodes, token);
  }

  #nodes = [];
  #interruption = '';

  #createRunningContext = (runningScope) => {
    return {
      [BREAK_ACTION]: () => {
        this.#interruption = BREAK_ACTION;
        const parentInterruption = getScopedValue(runningScope, [BREAK_ACTION]);
        if (parentInterruption) {
          parentInterruption();
        }
      },
      [CONTINUE_ACTION]: () => {
        this.#interruption = CONTINUE_ACTION;
        const parentInterruption = getScopedValue(runningScope, [
          CONTINUE_ACTION,
        ]);
        if (parentInterruption) {
          parentInterruption();
        }
      },
    };
  };

  get length() {
    return this.#nodes.length;
  }

  constructor(nodes, token) {
    super(token);

    this.#nodes = nodes;
  }

  execute(data, runningScope) {
    this.#interruption = '';
    let runningContext = this.#createRunningContext(runningScope);

    return this.#nodes
      .map((step) => {
        if (this.#interruption) {
          return '';
        }
        return step.execute(data, [runningContext, ...runningScope]);
      })
      .join('');
  }

  isEmpty() {
    return !this.#nodes.some((node) => !node.isEmpty());
  }

  toJSON() {
    return {
      node: 'Sequence',
      nodes: this.#nodes,
    };
  }
}
