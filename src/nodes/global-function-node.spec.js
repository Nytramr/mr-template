import global from '../global';
import { GlobalFunction } from './global-function-node';

jest.mock('../global', () => ({
  __esModule: true,
  default: {
    testFunction: jest.fn(
      (arg1, arg2) => () => `executed with ${arg1}, ${arg2}`,
    ),
    singleArg: jest.fn(),
  },
}));

describe('GlobalFunction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a reference to the global function with the given arguments', () => {
      let args = ['arg1', 2];
      new GlobalFunction('testFunction', args);

      expect(global.testFunction).toHaveBeenCalledWith(...args);
    });

    it('should throw Error when the global function does not exist', () => {
      expect(() => new GlobalFunction('no function')).toThrow(
        "Function 'no function' is not defined",
      );
    });

    it('should assign the created function to the execute method', () => {
      let fn = jest.fn();
      global.singleArg.mockReturnValue(fn);

      let globalFunction = new GlobalFunction('singleArg');

      globalFunction.execute('argument');

      expect(fn).toHaveBeenCalledWith('argument');
    });
  });
});
