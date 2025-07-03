import { DataAccessor } from './data-accessor-node';

export function createDummyNode(returnValue = '') {
  return {
    execute: jest.fn().mockReturnValue(returnValue),
    isEmpty: jest.fn().mockReturnValue(false),
  };
}

export function interruptionNode(interruption) {
  return {
    execute: jest.fn((_data, runningScopes) => {
      runningScopes[0][interruption]();
      return '';
    }),
  };
}

export function valueFromKey(key) {
  return DataAccessor.fromToken({ text: key });
}
