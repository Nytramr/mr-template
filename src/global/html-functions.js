import pipedNodeFactory from '../utils/node-utils';
import { escapeHTML, escapeJS } from '../utils/string-utils';

export function html(...args) {
  return pipedNodeFactory((...strings) => {
    return escapeHTML(strings.join(''));
  }, ...args);
}

export function urlquery(...args) {
  return pipedNodeFactory((...strings) => {
    return encodeURIComponent(strings.join(''));
  }, ...args);
}

export function js(...args) {
  return pipedNodeFactory((...strings) => {
    return escapeJS(strings.join(''));
  }, ...args);
}
