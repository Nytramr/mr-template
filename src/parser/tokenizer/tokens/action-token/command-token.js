import { PipelineToken } from '../pipeline-token';
import { ActionToken } from './action-token';

export class CommandToken extends ActionToken {
  static fromMatch(match) {
    let { text, start, end } = match;

    let pipeline = PipelineToken.fromMatch(match);
    return new CommandToken(text, start, end, pipeline);
  }

  get name() {
    return 'CommandToken';
  }

  build() {
    return this.pipeline.build();
  }

  toJSON() {
    let { block, endToken, ...rest } = super.toJSON();
    return rest;
  }
}
