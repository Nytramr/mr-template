import {
  BOOL_LOGIC_AND_ARGUMENT_ERROR,
  BOOL_LOGIC_NOT_ARGUMENT_ERROR,
  BOOL_LOGIC_OR_ARGUMENT_ERROR,
  MrRenderError,
} from '../errors';
import pipedNodeFactory from '../utils/node-utils';

export function or(...args) {
  return pipedNodeFactory((...values) => {
    if (values.length !== 2) {
      throw new MrRenderError(BOOL_LOGIC_OR_ARGUMENT_ERROR);
    }
    return values[0] || values[1];
  }, ...args);
}

export function and(...args) {
  return pipedNodeFactory((...values) => {
    if (values.length !== 2) {
      throw new MrRenderError(BOOL_LOGIC_AND_ARGUMENT_ERROR);
    }
    return values[0] && values[1];
  }, ...args);
}

export function not(...args) {
  return pipedNodeFactory((...values) => {
    if (values.length !== 1) {
      throw new MrRenderError(BOOL_LOGIC_NOT_ARGUMENT_ERROR);
    }
    return !values[0];
  }, ...args);
}
