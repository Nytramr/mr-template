import { LiteralText } from './literal-text-node';

describe('LiteralText', () => {
  describe('isEmpty', () => {
    test.each([[''], ['  '], ['\n \n']])('%s returns true', (text) => {
      const nodeEntity = new LiteralText(text);

      expect(nodeEntity.isEmpty()).toBe(true);
    });

    test.each([['Something'], ['Something else'], [' Bye.\n']])(
      '%s returns false',
      (text) => {
        const nodeEntity = new LiteralText(text);

        expect(nodeEntity.isEmpty()).toBe(false);
      },
    );
  });
});
