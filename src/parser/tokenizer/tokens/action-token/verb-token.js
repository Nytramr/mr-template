import { Sequence } from '../../../../nodes';
import { ActionToken } from './action-token';
import { NodeHashTable } from './token-to-node';

export class VerbActionToken extends ActionToken {
  get name() {
    return 'VerbActionToken';
  }

  build() {
    let nextNode = Sequence.getSequence(
      this.block.map((token) => token.build()),
    );

    let pipeline = this.pipeline.build();

    let elseNode = this.endToken && this.endToken.build();
    return new NodeHashTable[this.text](pipeline, nextNode, elseNode, this);
  }
}
