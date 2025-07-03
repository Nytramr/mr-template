import { STRING_TYPE } from '../constants';
import { MrTemplateError } from '../errors';
import pipedNodeFactory from '../utils/node-utils';

function joinValues(...values) {
  const joinChar = values.some((value) => typeof value !== STRING_TYPE)
    ? ' '
    : '';
  return values.join(joinChar);
}

export function print(...nodes) {
  return pipedNodeFactory(joinValues, ...nodes);
}

export function println(...nodes) {
  return pipedNodeFactory((...values) => values.join(' ') + '\n', ...nodes);
}

const VERB_REGEX = /%[qs%]/g;
// TODO: add more format verbs
// TODO: Check type of the value
const formatVerbs = {
  '%q': (value) => `"${value}"`,
  '%s': (value) => `${value}`,
};

function replaceVerbs(format, ...values) {
  let i = 0;
  return format.replace(VERB_REGEX, (match) => {
    if (match === '%%') {
      return '%';
    }
    const verb = formatVerbs[match];
    if (verb) {
      return verb(values[i++]);
    }
    throw new MrTemplateError(`Unknown verb: ${match}`);
  });
}

export function printf(formatNode, ...args) {
  return pipedNodeFactory(replaceVerbs, formatNode, ...args);
}
