import {
  IF_RESERVED_WORD,
  RANGE_RESERVED_WORD,
  WITH_RESERVED_WORD,
} from '../../../../constants';
import { Conditional, RangeLoop, ScopeSelection } from '../../../../nodes';

export const NodeHashTable = {
  [IF_RESERVED_WORD]: Conditional,
  [WITH_RESERVED_WORD]: ScopeSelection,
  [RANGE_RESERVED_WORD]: RangeLoop,
};
