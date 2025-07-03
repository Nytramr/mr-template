import globalFunctions from '../global';
import { AssignNode } from './assign-node';
import { BaseNode } from './base-node';
import { Constant } from './constant-node';
import { FunctionNode } from './function-node';
import { DataAccessor } from './data-accessor-node';
import { GlobalFunction } from './global-function-node';
import {
  ASSIGN_TYPE,
  FUNCTION_TYPE,
  PAREN_TYPE,
  SYMBOL_TYPE,
  VALUE_TYPE,
  VARIABLE_TYPE,
} from '../constants';

function toNode(pipe) {
  let head = pipe,
    rest;
  if (Array.isArray(pipe)) {
    [head, ...rest] = pipe;
  }

  //TODO: Use a hashmap
  switch (head.type) {
    case FUNCTION_TYPE:
      let args = rest.map(toNode);
      if (globalFunctions[head.text]) {
        return new GlobalFunction(head.text, args, head);
      }
      // TODO: Lets define the function "token"
      return new FunctionNode(head.text, head.fn, args);
    case SYMBOL_TYPE:
      break;
    case PAREN_TYPE:
      // TODO: Lets define the parentheses "token"
      return PipelineNode.fromTokenPipes(rest);
    case ASSIGN_TYPE:
      let [vars, pipes] = rest;
      let pipeline = PipelineNode.fromTokenPipes(pipes);

      // TODO: Lets define the assign "token"
      return new AssignNode(
        head,
        vars.filter((token) => token.type !== SYMBOL_TYPE),
        pipeline,
      );

    case VALUE_TYPE:
    case VARIABLE_TYPE:
      return DataAccessor.fromToken(head);
    default:
      return Constant.fromToken(head);
  }
}

export class PipelineNode extends BaseNode {
  static fromTokenPipes(pipes, token) {
    if (!pipes) {
      return;
    }
    //Ignore pipes
    let nodes = pipes
      .filter((pipe) => ![SYMBOL_TYPE, PAREN_TYPE].includes(pipe.type))
      .map(toNode);

    if (nodes.length === 1) {
      return nodes[0];
    }

    // TODO: Lets define the pipeline "token"
    return new PipelineNode(nodes, token);
  }

  #nodes = [];

  constructor(nodes, token) {
    super(token);
    this.#nodes = nodes;
  }

  isEmpty() {
    return !this.#nodes.some((node) => !node.isEmpty());
  }

  // TODO: Can custom functions have access to the running context?
  execute(data, runningScope) {
    return this.#nodes.reduce(
      (carryOn, node) => node.execute(data, runningScope, carryOn),
      undefined,
    );
  }

  toJSON() {
    return {
      node: 'Pipeline',
      nodes: this.#nodes,
    };
  }
}
