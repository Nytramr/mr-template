import { getLine } from './utils';
import {
  FUNCTION_NOT_DEFINED,
  functionNotDefined,
} from './function-not-defined';
import {
  NUMBER_SYNTAX_ERROR,
  UNTERMINATED_CHARACTER_CONSTANT_ERROR,
  UNTERMINATED_QUOTED_STRING_ERROR,
  UNTERMINATED_RAW_QUOTED_STRING_ERROR,
} from './types-errors';
import {
  END_ACTION_EXPECTED_ERROR,
  UNCLOSED_ACTION_ERROR,
  UNEXPECTED_ACTION_ERROR,
  UNEXPECTED_EOF_ERROR,
  UNEXPECTED_FLOW_ACTION_ERROR,
  UNEXPECTED_TOKEN_IN_ACTION_ERROR,
  UNEXPECTED_TOKEN_IN_CLAUSE_ERROR,
  UNEXPECTED_TOKEN_IN_COMMAND_ERROR,
  expectedEndAction,
  unclosedAction,
  unexpectedAction,
  unexpectedFlowControlToken,
  unexpectedTokenInAction,
  unexpectedTokenInClause,
  unexpectedTokenInCommand,
} from './action-errors';
import {
  MULTIPLE_DEFINITIONS_FOR_TEMPLATE_ERROR,
  multipleDefinitionsForTemplate,
} from './template-errors';
import {
  UNCLOSED_COMMENT_ERROR,
  unclosedComment,
} from './unclosed-comment-error';
import {
  EMPTY_PIPELINE_ERROR,
  UNCLOSED_PAREN_ERROR,
  unclosedParen,
} from './unclosed-paren-error';

export function createErrorTupleWithOffset(errorCode, token, bounds, origin) {
  let offset = token.start;
  let absBound = [+bounds[0] + offset, +bounds[1] + offset];
  let absOrigin = origin
    ? [+origin[0] + offset, +origin[1] + offset]
    : absBound;

  return [errorCode, token, absBound, absOrigin];
}

export function createErrorTuple(errorCode, token, bounds, origin) {
  let absOrigin = origin || bounds;

  return [errorCode, token, bounds, absOrigin];
}

export function basicErrorMessage(
  msg,
  templateName,
  templateText,
  errorDetails,
) {
  let [_token, bounds, _origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);

  let errorMsg = msg;

  if (errorLine > 1) {
    errorMsg = `${templateName}:${errorLine}: ` + errorMsg;
  }

  return errorMsg;
}

export const errorTransformers = {
  [EMPTY_PIPELINE_ERROR]: basicErrorMessage.bind(null, EMPTY_PIPELINE_ERROR),
  [END_ACTION_EXPECTED_ERROR]: expectedEndAction,
  [FUNCTION_NOT_DEFINED]: functionNotDefined,
  [MULTIPLE_DEFINITIONS_FOR_TEMPLATE_ERROR]: multipleDefinitionsForTemplate,
  [NUMBER_SYNTAX_ERROR]: basicErrorMessage.bind(null, NUMBER_SYNTAX_ERROR),
  [UNCLOSED_ACTION_ERROR]: unclosedAction,
  [UNCLOSED_COMMENT_ERROR]: unclosedComment,
  [UNCLOSED_PAREN_ERROR]: unclosedParen,
  [UNEXPECTED_ACTION_ERROR]: unexpectedAction,
  [UNEXPECTED_EOF_ERROR]: basicErrorMessage.bind(null, UNEXPECTED_EOF_ERROR),
  [UNEXPECTED_FLOW_ACTION_ERROR]: unexpectedFlowControlToken,
  [UNEXPECTED_TOKEN_IN_ACTION_ERROR]: unexpectedTokenInAction,
  [UNEXPECTED_TOKEN_IN_CLAUSE_ERROR]: unexpectedTokenInClause,
  [UNEXPECTED_TOKEN_IN_COMMAND_ERROR]: unexpectedTokenInCommand,
  [UNTERMINATED_CHARACTER_CONSTANT_ERROR]: basicErrorMessage.bind(
    null,
    UNTERMINATED_CHARACTER_CONSTANT_ERROR,
  ),
  [UNTERMINATED_QUOTED_STRING_ERROR]: basicErrorMessage.bind(
    null,
    UNTERMINATED_QUOTED_STRING_ERROR,
  ),
  [UNTERMINATED_RAW_QUOTED_STRING_ERROR]: basicErrorMessage.bind(
    null,
    UNTERMINATED_RAW_QUOTED_STRING_ERROR,
  ),
};

export {
  EMPTY_PIPELINE_ERROR,
  END_ACTION_EXPECTED_ERROR,
  FUNCTION_NOT_DEFINED,
  MULTIPLE_DEFINITIONS_FOR_TEMPLATE_ERROR,
  NUMBER_SYNTAX_ERROR,
  UNCLOSED_ACTION_ERROR,
  UNCLOSED_COMMENT_ERROR,
  UNCLOSED_PAREN_ERROR,
  UNEXPECTED_ACTION_ERROR,
  UNEXPECTED_EOF_ERROR,
  UNEXPECTED_FLOW_ACTION_ERROR,
  UNEXPECTED_TOKEN_IN_ACTION_ERROR,
  UNEXPECTED_TOKEN_IN_CLAUSE_ERROR,
  UNEXPECTED_TOKEN_IN_COMMAND_ERROR,
  UNTERMINATED_CHARACTER_CONSTANT_ERROR,
  UNTERMINATED_QUOTED_STRING_ERROR,
  UNTERMINATED_RAW_QUOTED_STRING_ERROR,
};
