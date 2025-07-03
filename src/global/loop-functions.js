import { BREAK_ACTION, CONTINUE_ACTION } from '../constants';
import { MrRenderError } from '../errors';
import { getScopedValue } from '../utils';

export function breakAction() {
  return (_, scopes) => {
    let action = getScopedValue(scopes, [BREAK_ACTION]);
    if (!action) {
      throw new MrRenderError('Error performing break');
    }
    action();
  };
}

export function continueAction() {
  return (_, scopes) => {
    let action = getScopedValue(scopes, [CONTINUE_ACTION]);
    if (!action) {
      throw new MrRenderError('Error performing continue');
    }
    action();
  };
}
