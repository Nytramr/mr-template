import { PipelineNode } from '../../../nodes';
import { processPipelineParts, verifyGraph } from './pipelines';
import { createErrorTuple } from '../../errors';
import { parseArgs } from './args/parse-args';
import { Token } from './token';

export class PipelineToken extends Token {
  static fromCommands(commands = []) {
    let length = commands.length;
    if (!length) {
      return;
    }

    let text = commands.map((token) => token.text).join(' ');
    let start = commands[0].start;
    let end = commands[length - 1].end;

    return new PipelineToken(text, start, end, commands);
  }

  #commands;
  #innerGraph;

  get name() {
    return 'PipelineToken';
  }

  get commands() {
    return this.#commands;
  }

  constructor(text, start, end, commands) {
    super(text, start, end);
    this.#commands = commands || parseArgs(this);
  }

  verify(functions) {
    this.#innerGraph = processPipelineParts([...this.#commands]);

    verifyGraph(this.#innerGraph, functions);

    return this.#commands.reduce((errors = [], token) => {
      if (token.error) {
        return errors.concat([
          createErrorTuple(token.error, this, [token.start, token.end]),
        ]);
      }
      return errors;
    }, []);
  }

  build() {
    const pipeline = PipelineNode.fromTokenPipes(this.#innerGraph, this);
    return pipeline;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      commands: this.#commands,
      innerGraph: this.#innerGraph,
    };
  }
}
