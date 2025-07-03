import { MrError, MrParseError } from '../errors';
import { splitInTokens } from './tokenizer/split';
import { toGraph } from './tokenizer/group';
import { Sequence } from '../nodes';
import {
  createErrorTuple,
  errorTransformers,
  MULTIPLE_DEFINITIONS_FOR_TEMPLATE_ERROR,
} from './errors';

export class Parser {
  static parse(name, templateText, functions) {
    let parser = new Parser(name, templateText, functions);
    parser.tokenize();
    let trees = parser.getTrees();

    return trees;
  }

  #templateText;
  #tokens = [];
  #mainName;
  #functions;
  #templatesGraphs;

  #mainGraph = null;
  #errors = null;

  #buildGraphToNodes(graph) {
    let nodes = graph.map((token) => token.build());
    return Sequence.getSequence(nodes);
  }

  #buildSubTemplateEntry(subTemplate) {
    let templateName = subTemplate.templateName;
    let templateGraph = subTemplate.block;

    return [templateName, this.#buildGraphToNodes(templateGraph)];
  }

  get errors() {
    if (!this.#errors) {
      return [];
    }
    return this.#errors.map((errorDetails) => {
      let [errorCode, ...rest] = errorDetails;
      let errorTransformer = errorTransformers[errorCode];

      return errorTransformer
        ? errorTransformer(this.#mainName, this.#templateText, rest)
        : `${errorCode}`;
    });
  }

  get tokens() {
    return this.#tokens;
  }

  get isValid() {
    return !!(this.#errors && !this.#errors.length);
  }

  constructor(name, templateText = '', functions = {}) {
    this.#mainName = name;
    this.#functions = functions;
    this.#templateText = templateText;
  }

  tokenize(templateText) {
    this.#templateText = templateText || this.#templateText;
    this.#tokens = splitInTokens(this.#templateText);
    let graphs = toGraph(this.#tokens);
    this.#mainGraph = graphs.main;
    this.#templatesGraphs = graphs.templates;

    return this;
  }

  verify(functions) {
    this.#functions = functions || this.#functions;
    if (this.#mainGraph === null) {
      throw new MrError('Parser must be tokenized prior verification');
    }

    // Verify every token and the relation between them
    this.#errors = this.#tokens.flatMap((token) =>
      token.verify(this.#functions),
    );

    // Verify not double templates
    if (this.#templatesGraphs.length) {
      let templateNames = [this.#mainName];
      for (let subTemplateToken of this.#templatesGraphs) {
        let templateName = subTemplateToken.templateName;
        if (templateNames.includes(templateName)) {
          this.#errors.push(
            createErrorTuple(
              MULTIPLE_DEFINITIONS_FOR_TEMPLATE_ERROR,
              subTemplateToken,
              subTemplateToken.bounds,
              subTemplateToken.templateToken.bounds,
            ),
          );
          continue;
        }
        templateNames.push(templateName);
      }
    }

    if (this.#errors.length) {
      throw new MrParseError('Parsing Error', this.#errors);
    }

    return this;
  }

  getTrees(functions) {
    if (this.#errors === null) {
      this.verify(functions);
    }
    if (this.isValid) {
      let subTemplates = this.#templatesGraphs.map((sub) =>
        this.#buildSubTemplateEntry(sub),
      );

      let nodes = this.#buildGraphToNodes(this.#mainGraph);
      let treeEntries = [...subTemplates, [this.#mainName, nodes]];

      return Object.fromEntries(treeEntries);
    }

    return null;
  }

  toJSON() {
    return {
      templateText: this.#templateText,
      name: this.#mainName,
      graph: this.#mainGraph,
      templates: this.#templatesGraphs,
      tokens: this.#tokens,
      errors: this.errors,
    };
  }
}
