function groupByPipelines(pipelineParts = []) {
  let pipelines = [];
  let currentPipeline = [];
  let part = pipelineParts.pop();
  let pipeline;
  while (part !== undefined) {
    switch (part.text) {
      case '(':
        pipeline = [part, ...groupByPipelines(pipelineParts)];
        currentPipeline.push(pipeline);
        break;
      case ')':
        pipelines.push(currentPipeline, part);
        return pipelines;
      case ':=':
      case '=':
        pipeline = groupByPipelines(pipelineParts);
        pipelines.push([part, currentPipeline, pipeline]);
        currentPipeline = [];
        break;
      case '|':
        pipelines.push(currentPipeline, part);
        currentPipeline = [];
        break;
      case '':
        break;
      default:
        currentPipeline.push(part);
    }
    part = pipelineParts.pop();
  }

  if (currentPipeline.length) {
    pipelines.push(currentPipeline);
  }

  return pipelines;
}

export function processPipelineParts(pipelineParts = []) {
  // We reverse the pipelineParts to loop using array.pop()
  const pipelines = groupByPipelines(pipelineParts.reverse());

  return pipelines;
}
