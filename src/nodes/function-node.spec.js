import { FunctionNode } from './function-node';

describe('FunctionNode', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should call the function with the given arguments', () => {
      let args = ['arg1', 2];
      let testFunction = jest.fn(
        (arg1, arg2) => () => `executed with ${arg1}, ${arg2}`,
      );
      new FunctionNode('myFunction', testFunction, args);

      expect(testFunction).toHaveBeenCalledWith(...args);
    });

    it('should assign the created function to the execute method', () => {
      let fn = jest.fn();
      let singleArg = jest.fn().mockReturnValue(fn);

      let node = new FunctionNode('myFunction', singleArg);

      node.execute('argument');

      expect(fn).toHaveBeenCalledWith('argument');
    });
  });
});
