import { parseArgs } from './parse-args';

describe('args', () => {
  describe('parseArgs', () => {
    describe('different types', () => {
      test.each([
        ['"My raw string"'],
        ['`My quoted string`'],
        ["' '"],
        ['1234'],
        ['-1234'],
        ['12.34'],
        ['-12.34'],
        ['false'],
        ['true'],
        ['.'],
        ['.value'],
        ['.nested.value'],
        ['nil'],
        ['eq'],
        ['myFunction'],
        ['unknown'],
      ])('%s', (text) => {
        let tokenObj = {
          text,
          start: 0,
        };

        let result = parseArgs(tokenObj, { myFunction: () => {} });

        expect(JSON.stringify(result)).toMatchSnapshot();
      });
    });

    describe('combinations', () => {
      test.each([
        ['.Name | trim | lower | capitalize'],
        ['"Hello, " | cat .Name'],
        ['index .Items 0 | lower'],
        ['len .Items | printf "Count: %d"'],
        ['.CreatedAt | date "2006-01-02"'],
        ['.Content | html'],
        ['true | false | myCustomFunc'],
        ['(index .Items 0 | upper) | printf "First Item: %s"'],
        ['"hello" | upper'],
        ['"WORLD" | lower'],
        ['"   GoLang   " | trim'],
        ['"Hello, " | cat "World!"'],
        ['"Golang Templates" | substring 0 6'],
        ['"Go! " | repeat 3'],
        ['123.456 | printf "%.2f"'],
        ['"Good" | cat " Morning" | upper'],
        ['slice "apple" "banana" "cherry" | join ", "'],
        ['"2023-05-22" | date "January 2, 2006"'],
      ])('%s', (text) => {
        let tokenObj = {
          text,
          start: 0,
        };

        let result = parseArgs(tokenObj, { myFunction: () => {} });

        expect(JSON.stringify(result)).toMatchSnapshot();
      });
    });

    describe('variables', () => {
      test.each([
        ['$v = 30'],
        ['$v = "name"'],
        ['$v = .value'],
        ['$v := 30'],
        ['$v := "name"'],
        ['$v := .value'],
      ])('%s', (text) => {
        let tokenObj = {
          text,
          start: 0,
        };

        let result = parseArgs(tokenObj, { myFunction: () => {} });

        expect(JSON.stringify(result)).toMatchSnapshot();
      });
    });
    // describe('', () => {});
  });
});
