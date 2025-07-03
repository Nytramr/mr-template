export default function pipedNodeFactory(fn, ...args) {
  return (data, runningScope, pipedArg) => {
    const values = args.map((arg) => {
      return arg.execute(data, runningScope);
    });
    if (pipedArg !== undefined) {
      values.push(pipedArg);
    }
    return fn(...values);
  };
}
