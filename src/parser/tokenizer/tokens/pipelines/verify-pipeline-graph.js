import {
  ASSIGN_TYPE,
  CHAR_TYPE,
  FUNCTION_TYPE,
  NUMBER_TYPE,
  PAREN_TYPE,
  STRING_TYPE,
  UNKNOWN_TYPE,
} from '../../../../constants';
import globalFunctions from '../../../../global';
import {
  EMPTY_PIPELINE_ERROR,
  FUNCTION_NOT_DEFINED,
  NUMBER_SYNTAX_ERROR,
  UNCLOSED_PAREN_ERROR,
  UNTERMINATED_CHARACTER_CONSTANT_ERROR,
  UNTERMINATED_QUOTED_STRING_ERROR,
  UNTERMINATED_RAW_QUOTED_STRING_ERROR,
} from '../../../errors';

const PROPER_QUOTED_STRING = /^([`"])[\s\S]*\1$/;
const PROPER_NUMBER = /^[-+]?[0-9]+(\.[0-9]+)?$/;

function verifyToken(token, functions) {
  // verify the token
  switch (token.type) {
    case UNKNOWN_TYPE:
      // So far, we have functions or an error.
      let fn = globalFunctions[token.text] || functions[token.text];
      token.fn = fn;
      token.type = FUNCTION_TYPE;
      token.error = !fn && FUNCTION_NOT_DEFINED;
      return;
    //Look for right parentheses
    case PAREN_TYPE:
      token.error = UNCLOSED_PAREN_ERROR;
      return;
    case CHAR_TYPE:
      if (!token.text.endsWith("'")) {
        token.error = UNTERMINATED_CHARACTER_CONSTANT_ERROR;
      }
      return;
    case STRING_TYPE:
      if (!PROPER_QUOTED_STRING.test(token.text)) {
        token.error =
          token.text[0] === '"'
            ? UNTERMINATED_QUOTED_STRING_ERROR
            : UNTERMINATED_RAW_QUOTED_STRING_ERROR;
      }
      return;
    case NUMBER_TYPE:
      if (!PROPER_NUMBER.test(token.text)) {
        token.error = NUMBER_SYNTAX_ERROR;
      }
      return;
    case undefined:
      return;
  }
}

function verifyPipe(pipe, functions) {
  const [first, ...rest] = pipe;
  if (!first) {
    return;
  }
  if (Array.isArray(first)) {
    verifyPipe(first, functions);
  } else {
    // verify the token
    switch (first.type) {
      //Look for parentheses
      case PAREN_TYPE:
        const last = rest.pop();
        if (last.type !== PAREN_TYPE) {
          first.error = UNCLOSED_PAREN_ERROR;
          rest.push(last);
        }
        if (!rest[0].length) {
          first.error = EMPTY_PIPELINE_ERROR;
        }
        verifyGraph(rest, functions);
        break;
      case ASSIGN_TYPE:
        let [vars, pipe] = rest;
        // TODO: Check var length
        // TODO: Check commas
        // TODO: Check initialize vs assignation
        verifyGraph(vars, functions);
        verifyGraph(pipe, functions);
        break;
      default:
        verifyToken(first, functions);
        verifyPipe(rest, functions);
    }
  }
}

export function verifyGraph(graph, functions = {}) {
  // if it is a token, verify the token
  graph.forEach((part, i) => {
    if (part.type) {
      verifyToken(part, functions);
      return;
    }
    verifyPipe(part, functions);
  });
}
