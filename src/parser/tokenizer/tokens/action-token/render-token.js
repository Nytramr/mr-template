import {
  DEFINE_RESERVED_WORD,
  TEMPLATE_RESERVED_WORD,
} from '../../../../constants';
import { RenderTemplate } from '../../../../nodes';
import { isStringBetweenQuotes } from '../../../../utils';
import {
  createErrorTuple,
  UNEXPECTED_TOKEN_IN_CLAUSE_ERROR,
  UNEXPECTED_TOKEN_IN_COMMAND_ERROR,
} from '../../../errors';
import { parseArgs } from '../args/parse-args';
import { PipelineToken } from '../pipeline-token';
import { StringToken } from '../string-token';
import { ERRORS_SYMBOL } from '../token';
import { ActionToken } from './action-token';

export class RenderToken extends ActionToken {
  static fromMatch({ text, start, end }, args) {
    if (!text) {
      return;
    }

    let [name, ...pipelineCommands] = parseArgs(args);
    let nameToken = StringToken.fromMatch(name);
    let pipeline = PipelineToken.fromCommands(pipelineCommands);

    return new RenderToken(text, start, end, nameToken, pipeline);
  }

  #templateToken;

  get firstArg() {
    return this.templateName;
  }

  get name() {
    return 'RenderToken';
  }

  get templateName() {
    return this.#templateToken.content;
  }

  get templateToken() {
    return this.#templateToken;
  }

  constructor(text, start, end, templateName, pipeline) {
    super(text, start, end, pipeline);
    this.#templateToken = templateName;
  }

  isEndingToken(nested = []) {
    if (nested.length && this.text !== TEMPLATE_RESERVED_WORD) {
      this[ERRORS_SYMBOL](
        createErrorTuple(UNEXPECTED_TOKEN_IN_COMMAND_ERROR, this, [
          this.start,
          this.end,
        ]),
      );
    }

    return false;
  }

  verify(functions) {
    if (!isStringBetweenQuotes(this.#templateToken.text)) {
      this[ERRORS_SYMBOL](
        createErrorTuple(UNEXPECTED_TOKEN_IN_CLAUSE_ERROR, this, [
          this.#templateToken.bounds,
        ]),
      );
    }

    super.verify(functions);

    return this.errors;
  }

  build() {
    if (this.text === DEFINE_RESERVED_WORD) {
      return;
    }

    return new RenderTemplate(
      this.templateName,
      this.pipeline && this.pipeline.build(),
    );
  }

  toJSON() {
    return {
      ...super.toJSON(),
      templateToken: this.#templateToken,
    };
  }
}
