import { BLOCK_RESERVED_WORD, DEFINE_RESERVED_WORD } from '../../../constants';
import { basicBlock } from './basic-block';
import { sequencer, containers } from './sequencer';

const blockContainers = {
  [BLOCK_RESERVED_WORD]: basicBlock.bind({}, sequencer),
  [DEFINE_RESERVED_WORD]: basicBlock.bind({}, sequencer),
};

export function toGraph(tokens) {
  let reverseTokens = Array.from(tokens).reverse();
  let templates = [];
  let main = [];
  let token = reverseTokens.pop();
  while (token) {
    // TODO: evaluate how do this in the verification process
    token.isEndingToken();
    main.push(token);
    let container;
    if ((container = blockContainers[token.text])) {
      templates.push(token);
      token = container(reverseTokens, token);
    } else {
      if ((container = containers[token.text])) {
        token = container(reverseTokens, token);
      } else {
        token = reverseTokens.pop();
      }
    }
  }

  return {
    main,
    templates,
  };
}
