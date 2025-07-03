/**
 * Is empty checks whenever a value is consider empty for "conditional" flows.
 *
 * It is consider empty:
 *  - undefined
 *  - null
 *  - false
 *  - blank strings
 *  - Arrays with no elements
 *  - Objects with no keys
 *
 * @param {*} value Any value to be evaluated
 * @returns true if the value is empty, otherwise false
 */
export function isEmpty(value) {
  return (value !== 0 && !value) || !Object.keys(value).length;
}
