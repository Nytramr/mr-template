import { BREAK_ACTION, CONTINUE_ACTION } from '../constants';
import { MrTemplateError } from '../errors';
import { getScopedValue } from '../utils';

export function breakAction() {
  return (_, scopes) => {
    let action = getScopedValue(scopes, [BREAK_ACTION]);
    if (!action) {
      throw new MrTemplateError('Error performing break');
    }
    action();
  };
}

export function continueAction() {
  return (_, scopes) => {
    let action = getScopedValue(scopes, [CONTINUE_ACTION]);
    if (!action) {
      throw new MrTemplateError('Error performing continue');
    }
    action();
  };
}
