import { Constant } from './constant-node';

describe('Constant', () => {
  it('should return the JSON representation', () => {
    let constantNode1 = new Constant('test');

    expect(JSON.stringify(constantNode1)).toBe(
      '{"node":"Constant","value":"test"}',
    );
  });

  describe('execution', () => {
    let constantNode1 = new Constant('test');
    let constantNode2 = new Constant('test2');

    it('should return the value', () => {
      expect(constantNode1.execute()).toBe('test');
      expect(constantNode2.execute()).toBe('test2');
    });

    it('should return the value regardless of the arguments passed to it', () => {
      expect(constantNode1.execute(1, 2, 3)).toBe('test');
      expect(constantNode2.execute(1, 2, 3)).toBe('test2');
    });
  });

  describe('stringConstant', () => {
    it('should return a Constant', () => {
      const instant = Constant.stringConstant('\\"test\\"');
      expect(instant).toBeInstanceOf(Constant);
    });

    it.each([
      ['String 1', 'String 1'],
      ['\\"String 1\\"', '"String 1"'],
      ['String \\"1\\"', 'String "1"'],
    ])('should return a string node ', (input, result) => {
      const node = Constant.stringConstant(input);

      expect(node.execute()).toBe(result);
    });
  });

  describe('isEmpty', () => {
    test.each([
      [''],
      ['  '],
      ['\n \n'],
      [['\n', '\n']],
      [{}],
      [[]],
      [[null]],
      [{ a: undefined }],
      [{ a: [] }],
    ])('%s returns true', (value) => {
      const nodeEntity = new Constant(value);

      expect(nodeEntity.isEmpty()).toBe(true);
    });

    test.each([['a'], [0], [' Bye.\n'], [false], [{ a: 0 }], [[0, false]]])(
      '%s returns false',
      (value) => {
        const nodeEntity = new Constant(value);

        expect(nodeEntity.isEmpty()).toBe(false);
      },
    );
  });
});
