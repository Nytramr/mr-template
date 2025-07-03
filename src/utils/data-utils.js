/**
 * Returns the value of the key from the data object.
 *
 * @param {object} data - The data object to obtain the value from .
 * @param {string[]} path - The key to get the value from the data object.
 * @returns
 *  - The whole `data` when `path` is empty,
 *  - The value referenced by the path if found,
 *  - `undefined` otherwise.
 */
export function getValue(data, path = []) {
  if (path.length) {
    return path.reduce((acc, curr) => acc && acc[curr], data);
  }
  return data;
}

/**
 * Performs a getValue on each scope, returning the first occurrence of the value.
 *
 * @param {object[]} scopes - The scopes to be searched.
 * @param {string[]} path - The path to get the value.
 * @returns
 *  - The first non-undefined scope when `path` is empty,
 *  - The first occurrence of value referenced by the path if found,
 *  - `undefined` otherwise.
 */
export function getScopedValue(scopes, path = []) {
  let i = 0;
  let result;
  while (
    scopes[i] !== undefined &&
    (result = getValue(scopes[i], path)) === undefined
  ) {
    i++;
  }
  return result;
}
