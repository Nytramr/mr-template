import { Constant } from '../nodes/constant-node';
import { valueFromKey } from '../nodes/test-utils';
import { call } from './call';

const helloNode = new Constant('Hello');
const worldNode = new Constant('world');

describe('call', () => {
  it('should return a function', () => {
    expect(call(valueFromKey('func'))).toBeInstanceOf(Function);
  });

  test('should include piped arg', () => {
    const data = { func: jest.fn() };
    const fn = call(valueFromKey('func'), helloNode);
    fn([data], [], 'world');
    expect(data.func).toHaveBeenCalledWith('Hello', 'world');
  });

  it.each`
    args                                         | expected
    ${[]}                                        | ${[]}
    ${[helloNode]}                               | ${['Hello']}
    ${[helloNode, worldNode]}                    | ${['Hello', 'world']}
    ${[helloNode, worldNode, new Constant('!')]} | ${['Hello', 'world', '!']}
  `('should call $expected', ({ args, expected }) => {
    const data = { func: jest.fn() };
    const fn = call(valueFromKey('func'), ...args);
    fn([data]);
    expect(data.func).toHaveBeenCalledWith(...expected);
  });
});
