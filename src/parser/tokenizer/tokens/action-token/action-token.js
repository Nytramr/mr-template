import { PipelineToken } from '../pipeline-token';
import { ERRORS_SYMBOL, Token } from '../token';

export class ActionToken extends Token {
  static fromMatch({ text, start, end }, args) {
    if (!text) {
      return;
    }

    const pipeline = args && PipelineToken.fromMatch(args);

    return new this(text, start, end, pipeline);
  }

  #pipeline;
  #endToken;
  #block;

  get name() {
    return 'ActionToken';
  }

  get endToken() {
    return this.#endToken;
  }

  set endToken(token) {
    this.#endToken = token;
  }

  get block() {
    return this.#block;
  }

  set block(tokens = []) {
    this.#block = tokens;
  }

  get pipeline() {
    return this.#pipeline;
  }

  constructor(text, start, end, pipeline) {
    super(text, start, end);
    this.#pipeline = pipeline;
  }

  verify(functions) {
    this.endToken && this[ERRORS_SYMBOL](...this.endToken.verify(functions));
    this.pipeline && this[ERRORS_SYMBOL](...this.pipeline.verify(functions));

    return this.errors;
  }

  build() {
    return;
  }

  toString() {
    return JSON.stringify(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      pipeline: this.#pipeline,
      block: this.#block,
      endToken: this.#endToken,
    };
  }
}
