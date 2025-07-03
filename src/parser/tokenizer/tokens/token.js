import { MrError } from '../../../errors';

export const ERRORS_SYMBOL = Symbol('tokenErrors');
export const ORIGINAL_TEXT_SYMBOL = Symbol('originalText');
export const TEXT_SYMBOL = Symbol('text');

export class Token {
  static fromMatch({ text, start, end }) {
    if (!text) {
      return;
    }
    return new this(text, start, end);
  }

  #originalText = '';
  #text;
  #start;
  #end;
  #errors = [];

  #appendErrors = (...errors) => {
    this.#errors.push(...errors);
  };

  get bounds() {
    return [this.#start, this.#end];
  }

  get name() {
    return '';
  }

  get text() {
    return this.#text;
  }

  get start() {
    return this.#start;
  }

  get end() {
    return this.#end;
  }

  get originalText() {
    return this.#originalText || this.#text;
  }

  get errors() {
    return this.#errors;
  }

  constructor(text, start, end) {
    this.#text = text;
    this.#start = start;
    this.#end = end;

    Object.defineProperties(this, {
      [ERRORS_SYMBOL]: {
        configurable: false,
        value: this.#appendErrors,
      },
      [ORIGINAL_TEXT_SYMBOL]: {
        enumerable: false,
        configurable: false,
        set(value) {
          this.#originalText = value;
        },
      },
      [TEXT_SYMBOL]: {
        enumerable: false,
        configurable: false,
        set(value) {
          this.#text = value;
        },
      },
    });
  }

  isEndingToken() {
    return false;
  }

  build() {
    throw new MrError('It is not possible to build a base token');
  }

  verify() {
    return this.#errors;
  }

  toString() {
    return JSON.stringify(this);
  }

  toJSON() {
    return {
      type: this.name,
      text: this.#text,
      start: this.#start,
      end: this.#end,
      originalText: this.originalText,
    };
  }
}
