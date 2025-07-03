import { VARIABLE_TYPE } from '../constants';
import { BaseNode } from './base-node';

/**
 * Returns a function that returns the value of the key from the data object.
 * @param {object} data - The data object to obtain the value from .
 * @param {string[]} path - The key to get the value from the data object.
 * @returns {Function} - A function that returns the value of the key from the data object.
 */
function getValue(data, path = []) {
  if (path.length) {
    return path.reduce(
      (acc, curr) => acc && (Object.hasOwn(acc, curr) ? acc[curr] : undefined),
      data,
    );
  }
  return data;
}

export class DataAccessor extends BaseNode {
  static fromToken(token) {
    let path = token.text.split('.').filter((key) => key !== '');
    return new DataAccessor(path, token);
  }

  #path = [];

  #getScopedValue(scopes) {
    let i = 0;
    let result;
    while (
      scopes[i] !== undefined &&
      (result = getValue(scopes[i], this.#path)) === undefined
    ) {
      i++;
    }
    return result;
  }

  constructor(path = [], token) {
    super(token);
    this.#path = path;
  }

  isEmpty() {
    // There is no way to know if a data accessor will be empty before execution
    return false;
  }

  execute(data, runningScope) {
    if (this.token.type === VARIABLE_TYPE) {
      return this.#getScopedValue(runningScope);
    }
    return this.#getScopedValue(data);
  }

  toJSON() {
    return {
      node: 'DataAccessor',
      path: this.#path,
    };
  }
}
