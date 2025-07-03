import {
  createErrorTuple,
  END_ACTION_EXPECTED_ERROR,
  UNEXPECTED_ACTION_ERROR,
  UNEXPECTED_TOKEN_IN_ACTION_ERROR,
} from '../../../errors';
import { Sequence } from '../../../../nodes';
import { ERRORS_SYMBOL } from '../token';
import { PipelineToken } from '../pipeline-token';
import { ActionToken } from './action-token';
import { parseArgs } from '../args/parse-args';
import { NodeHashTable } from './token-to-node';
import { ELSE_RESERVED_WORD, RANGE_RESERVED_WORD } from '../../../../constants';

export class ElseActionToken extends ActionToken {
  static fromMatch({ text, start, end }, args) {
    if (!text) {
      return;
    }

    if (!args) {
      return new this(text, start, end);
    }

    let [name = {}, ...pipelineCommands] = parseArgs(args);
    let pipeline = PipelineToken.fromCommands(pipelineCommands);

    return new this(text, start, end, name.text, pipeline);
  }

  #firstArg;

  get firstArg() {
    return this.#firstArg || '';
  }

  constructor(text, start, end, firstArg, pipeline) {
    super(text, start, end, pipeline);
    this.#firstArg = firstArg;
  }

  isEndingToken(nested = []) {
    switch (true) {
      case !nested[0]:
        this[ERRORS_SYMBOL](
          createErrorTuple(UNEXPECTED_ACTION_ERROR, this, [
            this.start,
            this.end,
          ]),
        );
        return false;
      case nested[0] === ELSE_RESERVED_WORD:
        this[ERRORS_SYMBOL](
          createErrorTuple(END_ACTION_EXPECTED_ERROR, this, [
            this.start,
            this.end,
          ]),
        );
        return false;
      case !!this.#firstArg &&
        (this.firstArg !== nested[0] || this.#firstArg === RANGE_RESERVED_WORD):
        this[ERRORS_SYMBOL](
          createErrorTuple(UNEXPECTED_TOKEN_IN_ACTION_ERROR, this, [
            this.start,
            this.end,
          ]),
        );
        return false;
    }
    return true;
  }

  build() {
    let nextNode = Sequence.getSequence(
      this.block.map((token) => token.build()),
    );

    if (!this.endToken || !this.pipeline) {
      return nextNode;
    }

    let pipeline = this.pipeline.build();
    let elseNode = this.endToken.build();
    return new NodeHashTable[this.#firstArg](
      pipeline,
      nextNode,
      elseNode,
      this,
    );
  }
}
