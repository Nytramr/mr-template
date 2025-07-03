import { NON_OVERWRITTEN_METHOD } from '../constants';
import { MrError } from '../errors';

export class BaseNode {
  #token;

  get token() {
    return this.#token;
  }

  constructor(token) {
    this.#token = token;
  }

  isEmpty() {
    return true;
  }

  getValue(data = [], runningScopes = []) {
    return this.execute(data, runningScopes);
  }

  execute() {
    throw new MrError(NON_OVERWRITTEN_METHOD);
  }

  toString() {
    return JSON.stringify(this);
  }

  toJSON() {
    throw new MrError(NON_OVERWRITTEN_METHOD);
  }
}
