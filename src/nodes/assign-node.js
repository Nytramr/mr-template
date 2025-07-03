import { MrTemplateError } from '../errors';
import { BaseNode } from './base-node';

export class AssignNode extends BaseNode {
  #type = '';
  #pipeline;
  #vars = [];
  #varNames = [];

  get name() {
    return 'AssignNode';
  }

  get isDeclaration() {
    return this.#type === ':=';
  }

  get varNames() {
    return this.#vars.map((varToken) => varToken.text);
  }

  #findScopes(runningScopes) {
    return this.#varNames.map((varName) =>
      runningScopes.find((scope) => Object.hasOwn(scope, varName)),
    );
  }

  /**
   * This method assign values to each variable on their scopes from a tuple of values.
   *
   * According to the specification, values must be assigned to the variables from right to left.
   *
   * In case there are more values than variables, the remaining values are omitted.
   *
   * Examples:
   *
   * |Declaration          | Variable values | Returned value|
   * |---------------------|-----------------|---------------|
   * |`$x := ['A']         | $x:'A'          | 'A'           |
   * |`$x := ['A', 'B']    | $x:'B'          | 'B'           |
   * |`$x $y := ['A', 'B'] | $x:'A', $y:'B'  | 'B'           |
   *
   * @param {running scopes} scopes A collection of running scopes, one for each variable
   * @param {Tuple} values A tuple of values to be assigned to the variables in their scopes
   * @returns The most "right" value
   */
  #assignValuesFromTuple(scopes, values) {
    let vIndex = values.length;
    return this.#varNames.reduceRight((_, current, nIndex) => {
      vIndex--;
      scopes[nIndex][current] = values[vIndex];
      return values[vIndex];
    }, null);
  }

  constructor(token, vars, pipeline) {
    super(token);

    this.#type = token.text;
    this.#pipeline = pipeline;
    this.#vars = vars;
    this.#varNames = vars.map((varToken) => varToken.text);
  }

  // This is used from range and with actions to assign values to the variables from an specific value
  setVarsFromTuple(runningScopes, ...values) {
    let scopes;

    if (this.isDeclaration) {
      // All new variables (:=) must be declared in the top scope.
      scopes = Array(this.#vars.length).fill(runningScopes[0]);
    } else {
      //Get scopes
      scopes = this.#findScopes(runningScopes);
      scopes.forEach((scope, i) => {
        if (!scope) {
          throw new MrTemplateError(`undefined variable: ${this.#varNames[i]}`);
        }
      });
    }

    return this.#assignValuesFromTuple(scopes, values);
  }

  // This is used from the range or with action to get the new "dot" value
  getValue(data = [], runningScopes = []) {
    return this.#pipeline.execute(data, runningScopes);
  }

  execute = (data = [], runningScopes = []) => {
    let value = this.#pipeline.execute(data, runningScopes);
    this.setVarsFromTuple(runningScopes, value);
  };

  toString = () => {
    return `{node: ${this.name},
    type: ${this.#type},
    pipeline: ${this.#pipeline.toString()},
    vars: [${this.#varNames.join(', ')}]}`;
  };

  toJSON() {
    return {
      node: this.name,
      type: this.#type,
      pipeline: this.#pipeline,
      vars: this.#vars,
    };
  }
}
