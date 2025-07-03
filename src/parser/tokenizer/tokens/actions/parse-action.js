import {
  RESERVED_WORDS,
  RENDERING_COMMANDS,
  FLOW_COMMANDS,
  ELSE_RESERVED_WORD,
  END_RESERVED_WORD,
} from '../../../../constants';
import { hashMatch } from '../../utils';
import {
  CommandToken,
  ElseActionToken,
  EndActionToken,
  FlowActionToken,
  RenderToken,
  VerbActionToken,
} from '../action-token';
import { CommentToken } from '../comment-token';
import { ORIGINAL_TEXT_SYMBOL } from '../token';

const SPLIT_ACTIONS_REG_EXP = RegExp(
  `^(?<verb>${RESERVED_WORDS.join('|')})(\\s+(?<args>.+)?|)$`,
  'dms',
);

function getActionToken(action) {
  let match = SPLIT_ACTIONS_REG_EXP.exec(action.text);

  if (match) {
    let { verb, args } = hashMatch(match, action.start);

    if (verb.text === END_RESERVED_WORD) {
      return EndActionToken.fromMatch(verb);
    }

    if (verb.text === ELSE_RESERVED_WORD) {
      return ElseActionToken.fromMatch(verb, args);
    }

    if (FLOW_COMMANDS.includes(verb.text)) {
      return FlowActionToken.fromMatch(verb, args);
    }

    if (RENDERING_COMMANDS.includes(verb.text)) {
      return RenderToken.fromMatch(verb, args);
    }

    return VerbActionToken.fromMatch(verb, args);
  }
  return CommandToken.fromMatch(action);
}

export function parseAction(matches) {
  let { action, comment } = matches;

  let actionToken;

  if (comment) {
    actionToken = CommentToken.fromMatch(comment);
  } else {
    actionToken = getActionToken(action);
  }

  actionToken[ORIGINAL_TEXT_SYMBOL] = matches._originalText;

  return actionToken;
}
