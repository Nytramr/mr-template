/**
 * Literal text
 *
 * Literal text nodes are formed from the text between actions on any given template.
 *
 * Literal text nodes are fixed and can not interact or being used by actions.
 *
 * A literal text composed only of white chars (' ', '\t', '\n', etc.) is considered empty in isolation.
 */
import { BaseNode } from './base-node';

export class LiteralText extends BaseNode {
  static fromToken(token) {
    return new LiteralText(token.text, token);
  }

  #text = '';

  get text() {
    return this.#text;
  }

  constructor(text, token) {
    super(token);
    this.#text = text;
  }

  isEmpty() {
    return !this.#text.trim();
  }

  execute() {
    return this.text;
  }

  toJSON() {
    return {
      node: 'LiteralText',
      text: this.#text,
    };
  }
}
