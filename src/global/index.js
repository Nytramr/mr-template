import { BREAK_RESERVED_WORD, CONTINUE_RESERVED_WORD } from '../constants';
import { eq, ge, gt, le, lt, ne } from './binary-comparison';
import { or, and, not } from './bool-logic';
import { call } from './call';
import { index, len, slice } from './collections';
import { html, js, urlquery } from './html-functions';
import { breakAction, continueAction } from './loop-functions';
import { print, printf, println } from './print';

const globalFunctions = {
  and,
  [BREAK_RESERVED_WORD]: breakAction,
  call,
  [CONTINUE_RESERVED_WORD]: continueAction,
  eq,
  ge,
  gt,
  html,
  index,
  js,
  le,
  len,
  lt,
  ne,
  not,
  or,
  print,
  printf,
  println,
  slice,
  urlquery,
};

export default globalFunctions;
