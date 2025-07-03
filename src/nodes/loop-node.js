import {
  BREAK_ACTION,
  BREAK_RESERVED_WORD,
  NUMBER_TYPE,
  OBJECT_TYPE,
  STRING_TYPE,
} from '../constants';
import { BaseNode } from './base-node';

function toRangeTuples(value) {
  switch (typeof value) {
    case STRING_TYPE:
    case OBJECT_TYPE:
      if (value !== null) {
        return Object.entries(value);
      }
    case NUMBER_TYPE:
      if (value > 0) {
        return Array.from({ length: value }, (_, i) => [i, i]);
      }
      break;
  }

  return [];
}

export class RangeLoop extends BaseNode {
  #valuePipeline;
  #elseNode;
  #nextNode;
  #interruption = '';

  #createRunningContext = () => {
    return {
      [BREAK_ACTION]: () => {
        this.#interruption = BREAK_RESERVED_WORD;
      },
    };
  };

  #executeLoop(tuple, data, runningScope) {
    // The first element in the tuple is the index, which is only used when it is assigned to a variable
    let [index, dot] = tuple;
    let runningContexts = [this.#createRunningContext(), ...runningScope];

    if (this.#valuePipeline.name === 'AssignNode') {
      dot = this.#valuePipeline.setVarsFromTuple(runningContexts, index, dot);
    }

    return this.#nextNode.execute([dot, ...data], runningContexts);
  }

  constructor(valuePipeline, nextNode, elseNode = '', token) {
    super(token);
    this.#valuePipeline = valuePipeline;
    this.#nextNode = nextNode;
    this.#elseNode = elseNode;
  }

  execute(data = [], runningScope = []) {
    // The way we create the range depends on the pipeline type
    let value = this.#valuePipeline.getValue(data, runningScope);
    let range = toRangeTuples(value);

    if (!range.length) {
      return this.#elseNode && this.#elseNode.execute(data, runningScope);
    }

    this.#interruption = '';

    return range
      .map((tuple) => {
        if (this.#interruption === BREAK_RESERVED_WORD) {
          return '';
        }

        return this.#executeLoop(tuple, data, runningScope);
      })
      .join('');
  }

  isEmpty() {
    return (
      this.#nextNode.isEmpty() && (!this.#elseNode || this.#elseNode.isEmpty())
    );
  }

  toJSON() {
    return {
      node: 'RangeLoop',
      valuePipeline: this.#valuePipeline,
      nextBlock: this.#nextNode,
      elseBlock: this.#elseNode,
    };
  }
}
