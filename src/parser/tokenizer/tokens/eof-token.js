import { createErrorTupleWithOffset, UNEXPECTED_EOF_ERROR } from '../../errors';
import { Token } from './token';

export class EOFToken extends Token {
  get name() {
    return 'EOF';
  }

  #pairToken;

  constructor(pairToken) {
    super('EOF', 0, -1);
    this.#pairToken = pairToken;
  }

  verify() {
    return [
      createErrorTupleWithOffset(
        UNEXPECTED_EOF_ERROR,
        this,
        [0, -1],
        [this.#pairToken.start, this.#pairToken.end],
      ),
    ];
  }

  build() {
    return;
  }
}
