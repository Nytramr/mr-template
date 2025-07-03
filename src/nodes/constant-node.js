import {
  BOOL_TYPE,
  CHAR_TYPE,
  NIL_TYPE,
  NUMBER_TYPE,
  OBJECT_TYPE,
  STRING_TYPE,
} from '../constants';
import { BaseNode } from './base-node';

const ALL_DOUBLE_QUOTES_REG_EXP = /\\"/g;

/**
 * Is empty checks whenever a value is consider empty for "conditional" flows.
 *
 * It is consider empty:
 *  - undefined
 *  - null
 *  - blank strings
 *  - Arrays with no elements
 *  - Objects with no keys
 *
 * @param {*} value Any value to be evaluated
 * @returns true if the value is empty, otherwise false
 */
function isEmpty(value) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value !== OBJECT_TYPE) {
    return !String(value).trim();
  }

  return !Object.values(value).some((v) => !isEmpty(v));
}

export class Constant extends BaseNode {
  static fromToken(token) {
    switch (token.type) {
      case STRING_TYPE:
      case CHAR_TYPE:
        // Trim the quotes
        return Constant.stringConstant(token.text.slice(1, -1), token);
      case BOOL_TYPE:
        return new Constant(token.text === 'true', token);
      case NUMBER_TYPE:
        return new Constant(+token.text, token);
      case NIL_TYPE:
        return new Constant(null, token);
    }
    // Throw error?
    return;
  }

  static NilConstant = new Constant(null);

  static stringConstant(string = '', token) {
    const template = string.replace(ALL_DOUBLE_QUOTES_REG_EXP, '"');
    return new Constant(template, token);
  }

  #value = undefined;

  constructor(value, token) {
    super(token);

    this.#value = value;
  }

  isEmpty() {
    return isEmpty(this.#value);
  }

  execute() {
    return this.#value;
  }

  toJSON() {
    return {
      node: 'Constant',
      value: this.#value,
    };
  }
}
