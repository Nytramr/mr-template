import { FUNCTION_TYPE } from '../constants';
import { MrTemplateError } from '../errors';
import pipedNodeFactory from '../utils/node-utils';

export function call(...args) {
  return pipedNodeFactory((fn, ...values) => {
    if (typeof fn !== FUNCTION_TYPE) {
      throw new MrTemplateError('First argument of call must be a function');
    }
    return fn(...values);
  }, ...args);
}
