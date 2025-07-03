import {
  IF_RESERVED_WORD,
  RANGE_RESERVED_WORD,
  WITH_RESERVED_WORD,
} from '../../../constants';
import { basicBlock } from './basic-block';
import { selfNested } from './self-nested';

export const containers = {
  [IF_RESERVED_WORD]: selfNested.bind({}, sequencer),
  [RANGE_RESERVED_WORD]: basicBlock.bind({}, sequencer),
  [WITH_RESERVED_WORD]: selfNested.bind({}, sequencer),
};

export function sequencer(tokens, path = []) {
  let sequence = [];
  let token = tokens.pop();

  while (token && !token.isEndingToken(path)) {
    sequence.push(token);
    let container;
    if ((container = containers[token.text])) {
      token = container(tokens, token, path);
    } else {
      token = tokens.pop();
    }
  }

  return [token, sequence];
}
