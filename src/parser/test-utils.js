import { CUSTOM_FUNCTION } from '../constants';

export function createDummyTemplate(templateData = {}) {
  return {
    [CUSTOM_FUNCTION]: {},
    ...templateData,
  };
}

export function JSONlog(...msgs) {
  let last = msgs.pop();

  console.log(...msgs, JSON.stringify(last, null, 2));
}
