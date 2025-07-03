import { ELSE_RESERVED_WORD, END_RESERVED_WORD } from '../../../constants';

export function selfNested(sequencer, tokens, current = {}, path = []) {
  let [endToken, sequence] = sequencer(tokens, [
    current.firstArg || current.text,
    ...path,
  ]);

  current.block = sequence;

  switch (endToken.text) {
    case ELSE_RESERVED_WORD:
      current.endToken = endToken;
      return selfNested(sequencer, tokens, endToken, path);
    case END_RESERVED_WORD:
      current.endToken = endToken;
    default:
      return tokens.pop();
  }
}
