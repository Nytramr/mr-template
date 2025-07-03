import { ELSE_RESERVED_WORD, END_RESERVED_WORD } from '../../../constants';
import { EOFToken } from '../tokens';

export function basicBlock(sequencer, tokens, current = {}, path = []) {
  let [endToken, sequence] = sequencer(tokens, [current.text, ...path]);

  current.block = sequence;

  if (!endToken) {
    current.endToken = new EOFToken(current);
    return;
  }

  switch (endToken.text) {
    case ELSE_RESERVED_WORD:
      current.endToken = endToken;
      return basicBlock(sequencer, tokens, endToken, path);
    case END_RESERVED_WORD:
      current.endToken = endToken;
      return tokens.pop();
    default:
      return endToken;
  }
}
