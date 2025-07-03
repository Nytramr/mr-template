import { STRING_TYPE } from '../../../constants';
import { Constant } from '../../../nodes';
import { getStringContent } from '../../../utils';
import { Token } from './token';

export class StringToken extends Token {
  get content() {
    return getStringContent(this.text);
  }

  get name() {
    return 'StringToken';
  }

  get type() {
    return STRING_TYPE;
  }

  build() {
    return Constant.fromToken(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: STRING_TYPE,
      content: this.content,
    };
  }
}
