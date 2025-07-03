import { LiteralText } from '../../../nodes';
import {
  createErrorTupleWithOffset,
  UNCLOSED_ACTION_ERROR,
} from '../../errors';
import {
  ERRORS_SYMBOL,
  ORIGINAL_TEXT_SYMBOL,
  TEXT_SYMBOL,
  Token,
} from './token';

const OPEN_ACTION = /(?:^|[^\\])(\{\{)[\s\S]*/dm;

export class LiteralToken extends Token {
  get name() {
    return 'LiteralToken';
  }

  constructor(text, start, end) {
    super(text, start, end);
    this[ORIGINAL_TEXT_SYMBOL] = text;
  }

  trimFromPost() {
    this[TEXT_SYMBOL] = this.text.trimStart();
  }

  trimFromPre() {
    this[TEXT_SYMBOL] = this.text.trimEnd();
  }

  verify() {
    // Look for unclosed
    let match = OPEN_ACTION.exec(this.text);

    if (match) {
      this[ERRORS_SYMBOL](
        createErrorTupleWithOffset(
          UNCLOSED_ACTION_ERROR,
          this,
          match.indices[0],
          match.indices[1],
        ),
      );
    }

    return this.errors;
  }

  build() {
    return this.text && new LiteralText(this.text);
  }
}
