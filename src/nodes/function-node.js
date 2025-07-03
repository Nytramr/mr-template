import { BaseNode } from './base-node';

export class FunctionNode extends BaseNode {
  #functionName = '';
  #args = [];

  get name() {
    return 'FunctionNode';
  }

  constructor(functionName, fn, argNodes = [], token) {
    super(token);

    this.#functionName = functionName;
    this.#args = argNodes;
    this.execute = fn(...argNodes).bind(this);
  }

  isEmpty() {
    // There is no way to know if a function return value will be empty before execution
    return false;
  }

  toJSON() {
    return {
      node: this.name,
      name: this.#functionName,
      args: this.#args,
    };
  }
}
