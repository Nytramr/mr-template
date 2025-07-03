export function operatorToNode(operator) {
  return {
    execute: operator,
  };
}

export function executeOperator(operator, pipedValue, data = [{}]) {
  return operator(data, [{}], pipedValue);
}
