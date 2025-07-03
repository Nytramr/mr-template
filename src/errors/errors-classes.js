export class MrError extends Error {
  #errors;

  get errors() {
    return JSON.parse(JSON.stringify(this.#errors));
  }

  constructor(msg, errors = [], options = {}) {
    super(msg, options);
    this.#errors = errors;
  }
}
export class MrParseError extends MrError {}
export class MrTemplateError extends MrError {}
