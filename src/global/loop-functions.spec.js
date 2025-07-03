import { BREAK_ACTION, CONTINUE_ACTION } from '../constants';
import { breakAction, continueAction } from './loop-functions';

let parentScope1 = {
  [BREAK_ACTION]: jest.fn(),
  [CONTINUE_ACTION]: jest.fn(),
};

let parentScope2 = {
  [BREAK_ACTION]: jest.fn(),
  [CONTINUE_ACTION]: jest.fn(),
};

let parentScope3 = {
  [BREAK_ACTION]: jest.fn(),
  [CONTINUE_ACTION]: jest.fn(),
};

let parentScope4 = {
  [BREAK_ACTION]: jest.fn(),
  [CONTINUE_ACTION]: jest.fn(),
};

describe('breakAction', () => {
  let bAction = breakAction();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a function', () => {
    expect(bAction).toBeInstanceOf(Function);
  });

  it('should execute the breakAction from the closest scope', () => {
    bAction([], [parentScope1, {}, parentScope2]);
    bAction([], [{}, parentScope3, {}, parentScope4]);

    expect(parentScope1[BREAK_ACTION]).toHaveBeenCalled();
    expect(parentScope2[BREAK_ACTION]).not.toHaveBeenCalled();
    expect(parentScope3[BREAK_ACTION]).toHaveBeenCalled();
    expect(parentScope4[BREAK_ACTION]).not.toHaveBeenCalled();
  });

  it('should throw an error if no scope has a breakAction', () => {
    expect(() => bAction([], [{}])).toThrow('Error performing break');
  });
});

describe('continueAction', () => {
  let cAction = continueAction();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a function', () => {
    expect(cAction).toBeInstanceOf(Function);
  });

  it('should execute the continueAction from the closest scope', () => {
    cAction([], [parentScope1, {}, parentScope2]);
    cAction([], [{}, parentScope3, {}, parentScope4]);

    expect(parentScope1[CONTINUE_ACTION]).toHaveBeenCalled();
    expect(parentScope2[CONTINUE_ACTION]).not.toHaveBeenCalled();
    expect(parentScope3[CONTINUE_ACTION]).toHaveBeenCalled();
    expect(parentScope4[CONTINUE_ACTION]).not.toHaveBeenCalled();
  });

  it('should throw an error if no scope has a continueAction', () => {
    expect(() => cAction([], [{}])).toThrow('Error performing continue');
  });
});
