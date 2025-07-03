import { DataAccessor } from './data-accessor-node';

describe('getValue', () => {
  it('should return a DataAccessor Node', () => {
    expect(DataAccessor.fromToken({ text: 'test' })).toBeInstanceOf(
      DataAccessor,
    );
  });

  describe('accessing data', () => {
    test('an empty key should return the data object', () => {
      let data = {
        value1: 'test1',
        value2: 'test2',
      };
      expect(DataAccessor.fromToken({ text: '' }).execute([data])).toBe(data);
      expect(DataAccessor.fromToken({ text: '.' }).execute([data])).toBe(data);
      expect(DataAccessor.fromToken({ text: '..' }).execute([data])).toBe(data);
    });

    describe('simple key', () => {
      test('should return the value of the key', () => {
        let data = [
          {
            value1: 'test1',
            value2: 'test2',
          },
        ];
        expect(DataAccessor.fromToken({ text: 'value1' }).execute(data)).toBe(
          'test1',
        );
        expect(DataAccessor.fromToken({ text: 'value2' }).execute(data)).toBe(
          'test2',
        );
      });

      test('should return the value of the key from different data inputs', () => {
        let dataA = [
          {
            value1: 'test1_A',
            value2: 'test2_A',
          },
        ];
        let dataB = [
          {
            value1: 'test1_B',
            value2: 'test2_B',
          },
        ];

        const getValueNode = DataAccessor.fromToken({ text: 'value1' });

        expect(getValueNode.execute(dataA)).toBe('test1_A');
        expect(getValueNode.execute(dataB)).toBe('test1_B');
      });
    });

    describe('nested key', () => {
      test('should return the value of the key (nested)', () => {
        let data = [
          {
            user: {
              name: 'John',
              age: 30,
            },
          },
        ];
        expect(
          DataAccessor.fromToken({ text: 'user.name' }).execute(data),
        ).toBe('John');
        expect(DataAccessor.fromToken({ text: 'user.age' }).execute(data)).toBe(
          30,
        );
      });

      test('should return the value of the key from different data inputs', () => {
        let dataA = [
          {
            user: {
              name: 'John_A',
              age: 30,
            },
          },
        ];
        let dataB = [
          {
            user: {
              name: 'John_B',
              age: 31,
            },
          },
        ];

        const getUserNameNode = DataAccessor.fromToken({ text: 'user.name' });
        const getUserAgeNode = DataAccessor.fromToken({ text: 'user.age' });

        expect(getUserNameNode.execute(dataA)).toBe('John_A');
        expect(getUserAgeNode.execute(dataA)).toBe(30);
        expect(getUserNameNode.execute(dataB)).toBe('John_B');
        expect(getUserAgeNode.execute(dataB)).toBe(31);
      });
    });

    describe('array index', () => {
      test('should return the value of the key (string)', () => {
        let data = [
          {
            users: ['John', 'Jane', 'Jim'],
          },
        ];
        expect(DataAccessor.fromToken({ text: 'users.0' }).execute(data)).toBe(
          'John',
        );
        expect(DataAccessor.fromToken({ text: 'users.1' }).execute(data)).toBe(
          'Jane',
        );
        expect(DataAccessor.fromToken({ text: 'users.2' }).execute(data)).toBe(
          'Jim',
        );
      });

      test('should return the value of the key (objects)', () => {
        let data = [
          {
            users: [
              { name: 'John', age: 30 },
              { name: 'Jane', age: 25 },
            ],
          },
        ];
        expect(
          DataAccessor.fromToken({ text: 'users.0.name' }).execute(data),
        ).toBe('John');
        expect(
          DataAccessor.fromToken({ text: 'users.1.name' }).execute(data),
        ).toBe('Jane');
        expect(
          DataAccessor.fromToken({ text: 'users.0.age' }).execute(data),
        ).toBe(30);
        expect(
          DataAccessor.fromToken({ text: 'users.1.age' }).execute(data),
        ).toBe(25);
      });
    });

    describe('multiple scopes', () => {
      let scope1 = {
        value1: 'test1',
        value2: 'test2',
      };

      let scope2 = {
        value1: 'test3',
        value3: 'test4',
      };

      test('values are overridden', () => {
        const valueNode = DataAccessor.fromToken({ text: '.value1' });

        expect(valueNode.execute([scope1, scope2])).toBe('test1');
        expect(valueNode.execute([scope2, scope1])).toBe('test3');
      });

      test('access to the parent scope', () => {
        const valueNode1 = DataAccessor.fromToken({ text: '.value3' });
        const valueNode2 = DataAccessor.fromToken({ text: '.value2' });

        expect(valueNode1.execute([scope1, scope2])).toBe('test4');
        expect(valueNode2.execute([scope2, scope1])).toBe('test2');
      });

      test('non existing values return undefined', () => {
        const valueNode = DataAccessor.fromToken({ text: '.value4' });

        expect(valueNode.execute([scope1, scope2])).toBeUndefined();
      });
    });
  });

  describe('accessing variables', () => {
    let data = {
      value1: 'test1',
      value2: 'test2',
    };

    let runningContexts = [
      { $a: ['a'], $o: { prop1: 'prop1', prop2: { key1: 1, key2: 2 } } },
      { $x: 'x', $y: 'y', $a: 'never reach' },
      { $: data },
    ];

    describe('access the global $', () => {
      it('should return the value of $', () => {
        expect(
          DataAccessor.fromToken({ text: '$', type: 'variable' }).execute(
            data,
            runningContexts,
          ),
        ).toBe(data);
      });

      it("should return a property's value of $", () => {
        expect(
          DataAccessor.fromToken({
            text: '$.value1',
            type: 'variable',
          }).execute(data, runningContexts),
        ).toBe(data.value1);
      });
    });

    describe('simple variable access', () => {
      it('should return the value for the variable', () => {
        expect(
          DataAccessor.fromToken({
            text: '$x',
            type: 'variable',
          }).execute(data, runningContexts),
        ).toBe('x');

        expect(
          DataAccessor.fromToken({
            text: '$y',
            type: 'variable',
          }).execute(data, runningContexts),
        ).toBe('y');
      });

      it('should return the value for the variable in the right scope', () => {
        expect(
          DataAccessor.fromToken({
            text: '$a',
            type: 'variable',
          }).execute(data, runningContexts),
        ).toEqual(['a']);
      });

      it("should return the value for the variable's path", () => {
        expect(
          DataAccessor.fromToken({
            text: '$o.prop1',
            type: 'variable',
          }).execute(data, runningContexts),
        ).toEqual('prop1');

        expect(
          DataAccessor.fromToken({
            text: '$o.prop2.key2',
            type: 'variable',
          }).execute(data, runningContexts),
        ).toEqual(2);
      });
    });
  });
});
