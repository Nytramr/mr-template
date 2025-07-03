import {
  BINARY_COMPARISON_GE_ARGUMENTS_ERROR,
  BINARY_COMPARISON_GT_ARGUMENTS_ERROR,
  BINARY_COMPARISON_LE_ARGUMENTS_ERROR,
  BINARY_COMPARISON_LT_ARGUMENTS_ERROR,
  BINARY_COMPARISON_NE_ARGUMENTS_ERROR,
  MrRenderError,
} from '../errors';
import pipedNodeFactory from '../utils/node-utils';

export function eq(...args) {
  return pipedNodeFactory((origin, ...values) => {
    return !values.some((value) => origin !== value);
  }, ...args);
}

export function ne(...args) {
  return pipedNodeFactory((...values) => {
    if (values.length !== 2) {
      throw new MrRenderError(BINARY_COMPARISON_NE_ARGUMENTS_ERROR);
    }
    return values[0] !== values[1];
  }, ...args);
}

export function lt(...args) {
  return pipedNodeFactory((...values) => {
    if (values.length !== 2) {
      throw new MrRenderError(BINARY_COMPARISON_LT_ARGUMENTS_ERROR);
    }
    return values[0] < values[1];
  }, ...args);
}
export function le(...args) {
  return pipedNodeFactory((...values) => {
    if (values.length !== 2) {
      throw new MrRenderError(BINARY_COMPARISON_LE_ARGUMENTS_ERROR);
    }
    return values[0] <= values[1];
  }, ...args);
}
export function gt(...args) {
  return pipedNodeFactory((...values) => {
    if (values.length !== 2) {
      throw new MrRenderError(BINARY_COMPARISON_GT_ARGUMENTS_ERROR);
    }
    return values[0] > values[1];
  }, ...args);
}
export function ge(...args) {
  return pipedNodeFactory((...values) => {
    if (values.length !== 2) {
      throw new MrRenderError(BINARY_COMPARISON_GE_ARGUMENTS_ERROR);
    }
    return values[0] >= values[1];
  }, ...args);
}
