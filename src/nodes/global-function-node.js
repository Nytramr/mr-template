import { MrTemplateError } from '../errors';
import global from '../global';
import { FunctionNode } from './function-node';

export class GlobalFunction extends FunctionNode {
  get name() {
    return 'GlobalFunction';
  }

  constructor(functionName, argNodes = [], token) {
    const fn = global[functionName];
    if (!fn) {
      throw new MrTemplateError(`Function '${functionName}' is not defined`);
    }
    super(functionName, fn, argNodes, token);
  }
}
