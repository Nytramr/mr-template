import { MrError } from './errors';
import { pipedNodeFactory } from './utils';
import { Parser } from './parser';
import {
  CUSTOM_FUNCTION,
  TEMPLATE_LOOKUP,
  TEMPLATE_EXECUTE_TEMPLATE,
  FUNCTION_TYPE,
} from './constants';

const SET_TEMPLATE_TREE = Symbol('set_template_tree');

export class Template {
  #name;
  #tree;
  #templates = {};
  #runningScope;

  #wrapFunction(func) {
    return (...args) => pipedNodeFactory(func, ...args);
  }

  // The initial running scope will contain the custom functions
  #createRunningScope = (data) => ({
    ...this[CUSTOM_FUNCTION],
    ...this.#runningScope,
    $: data,
  });

  #setTree = (tree) => {
    if (!tree.isEmpty()) {
      this.#tree = tree;
    }
    return this;
  };

  get templates() {
    return this.#templates;
  }

  get name() {
    return this.#name;
  }

  get tree() {
    return this.#tree;
  }

  get parser() {
    return new Parser(this.#name);
  }

  constructor(name, functions = {}, templates = {}) {
    this.#name = name;
    this.#templates = templates;
    this[CUSTOM_FUNCTION] = functions;

    this.#runningScope = {
      [TEMPLATE_LOOKUP]: this.lookup.bind(this),
      [TEMPLATE_EXECUTE_TEMPLATE]: this.executeTemplate.bind(this),
    };

    this[SET_TEMPLATE_TREE] = this.#setTree;
  }

  addParseTree(name, tree) {
    if (name === this.#name) {
      this.#setTree(tree);
      this.#templates[name] = this;
      return this;
    }

    if (!this.#templates[name]) {
      this.#templates[name] = new Template(
        name,
        this[CUSTOM_FUNCTION],
        this.#templates,
      );
    }

    // replace definition
    return this.#templates[name][SET_TEMPLATE_TREE](tree);
  }

  clone() {
    let newTemplate = new Template(this.#name, { ...this[CUSTOM_FUNCTION] });

    for (let templateName in this.#templates) {
      newTemplate.addParseTree(
        templateName,
        this.#templates[templateName].tree,
      );
    }

    return newTemplate;
  }

  execute(data) {
    let runningScope = this.#createRunningScope(data);
    return this.#tree ? this.#tree.execute([data], [runningScope]) : '';
  }

  executeTemplate(name, data) {
    let template = this.#templates[name];
    if (!template) {
      throw new MrError(
        `template: no template ${name} associated with template ${this.#name}`,
      );
    }
    return template ? template.execute(data) : '';
  }

  funcs(funcMap) {
    let funcMapEntries = Object.entries(funcMap);
    let noFunc = funcMapEntries.find(
      ([_, func]) => typeof func !== FUNCTION_TYPE,
    );
    if (noFunc) {
      throw new MrError(`Member '${noFunc[0]}' is not a Function`);
    }

    Object.assign(
      this[CUSTOM_FUNCTION],
      funcMapEntries.reduce(
        (obj, [funcName, func]) => ({
          ...obj,
          [funcName]: this.#wrapFunction(func),
        }),
        {},
      ),
    );

    return this;
  }

  lookup(name) {
    return this.#templates[name];
  }

  parse(templateText) {
    let trees = Parser.parse(this.#name, templateText, this[CUSTOM_FUNCTION]);

    for (let name in trees) {
      let tree = trees[name];

      this.addParseTree(name, tree);
    }

    return this;
  }
}
