import {
  createErrorTuple,
  UNEXPECTED_FLOW_ACTION_ERROR,
  UNEXPECTED_TOKEN_IN_ACTION_ERROR,
} from '../../../errors';
import { GlobalFunction } from '../../../../nodes';
import { ERRORS_SYMBOL } from '../token';
import { ActionToken } from './action-token';
import { RANGE_RESERVED_WORD } from '../../../../constants';

export class FlowActionToken extends ActionToken {
  get firstArg() {
    return this.pipeline && this.pipeline.commands[0].text;
  }

  isEndingToken(nested = []) {
    if (!nested.includes(RANGE_RESERVED_WORD)) {
      this[ERRORS_SYMBOL](
        createErrorTuple(UNEXPECTED_FLOW_ACTION_ERROR, this, [
          this.start,
          this.end,
        ]),
      );
    }

    if (this.pipeline) {
      this[ERRORS_SYMBOL](
        createErrorTuple(UNEXPECTED_TOKEN_IN_ACTION_ERROR, this, [
          this.start,
          this.end,
        ]),
      );
    }

    return false;
  }

  build() {
    return new GlobalFunction(this.text, [], this);
  }
}
