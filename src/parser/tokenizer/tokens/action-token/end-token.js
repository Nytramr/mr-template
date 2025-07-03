import { createErrorTuple, UNEXPECTED_ACTION_ERROR } from '../../../errors';
import { ERRORS_SYMBOL } from '../token';
import { ActionToken } from './action-token';

export class EndActionToken extends ActionToken {
  get name() {
    return 'EndToken';
  }

  isEndingToken(nested = []) {
    if (!nested.length) {
      this[ERRORS_SYMBOL](
        createErrorTuple(UNEXPECTED_ACTION_ERROR, this, [this.start, this.end]),
      );
    }

    return true;
  }
}
