import { TEMPLATE_EXECUTE_TEMPLATE } from '../constants';
import { getScopedValue } from '../utils';
import { BaseNode } from './base-node';
import { Constant } from './constant-node';

export class RenderTemplate extends BaseNode {
  #templateName = '';
  #arg;

  constructor(templateName, argNode = Constant.NilConstant, token) {
    super(token);
    this.#templateName = templateName;
    this.#arg = argNode;
  }

  execute(data, runningScope) {
    let inputData = this.#arg.execute(data, runningScope);

    let executeTemplate = getScopedValue(runningScope, [
      TEMPLATE_EXECUTE_TEMPLATE,
    ]);

    return executeTemplate(this.#templateName, inputData);
  }

  isEmpty() {
    // There is no way to know if a sub-template will be empty before execution
    return false;
  }

  toJSON() {
    return {
      node: 'RenderTemplate',
      name: this.#templateName,
      arg: this.#arg,
    };
  }
}
