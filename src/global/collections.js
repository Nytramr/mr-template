import pipedNodeFactory from '../utils/node-utils';

export function len(...args) {
  return pipedNodeFactory((collection, ..._rest) => {
    return collection ? Object.values(collection).length : 0;
  }, ...args);
}

export function index(...args) {
  return pipedNodeFactory((collection = [], ...indexes) => {
    const value = indexes.reduce(
      (element, i) => element && element.at(i),
      collection,
    );

    return value !== undefined ? value : null;
  }, ...args);
}

export function slice(...args) {
  return pipedNodeFactory((collection = [], ...values) => {
    // TODO: Validate values
    // if (values.length > 4) {
    //   throw new Error('too many arguments passed to slice');
    // }
    // values.forEach((value, i) => {
    //   if (!isFinite(value)) {
    //     throw new Error(`Argument ${i + 1} is not a number`);
    //   }
    // });

    const length = collection.length;

    let [low = 0, high = null, max = null] = values;
    low = +low; // Null will become 0, which is correct
    max = max !== null ? +max : length;
    high = high !== null ? +high : max;

    if (low > length) {
      return [];
    }

    return collection.slice(low, high);
  }, ...args);
}
