import {
  createErrorTupleWithOffset,
  UNCLOSED_COMMENT_ERROR,
} from '../../errors';
import { ERRORS_SYMBOL, Token } from './token';

export class CommentToken extends Token {
  get name() {
    return 'CommentToken';
  }

  verify() {
    if (!this.text.endsWith('*/')) {
      //Bounds [0, 2] means the first 2 chars of the comment which are '/*' by definition
      this[ERRORS_SYMBOL](
        createErrorTupleWithOffset(UNCLOSED_COMMENT_ERROR, this, [0, 2]),
      );
    }
    return this.errors;
  }

  build() {
    return;
  }
}
