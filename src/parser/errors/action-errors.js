import { getLine } from './utils';

export const END_ACTION_EXPECTED_ERROR = 'expected end;';
export const UNCLOSED_ACTION_ERROR = 'unclosed action';
export const UNEXPECTED_ACTION_ERROR = 'unexpected action';
export const UNEXPECTED_EOF_ERROR = 'unexpected EOF';
export const UNEXPECTED_FLOW_ACTION_ERROR = 'unexpected flow control action';
export const UNEXPECTED_TOKEN_IN_ACTION_ERROR = 'unexpected token in action';
export const UNEXPECTED_TOKEN_IN_CLAUSE_ERROR = 'unexpected token in clause';
export const UNEXPECTED_TOKEN_IN_COMMAND_ERROR = 'unexpected token in command';

export function expectedEndAction(templateName, templateText, errorDetails) {
  let [token, bounds, origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let sourceLine = getLine(templateText, origin[1]);

  let errorMsg = `expected end; found ${token.originalText}`;

  if (errorLine > 1) {
    errorMsg = `${templateName}:${errorLine}: ` + errorMsg;

    if (errorLine !== sourceLine) {
      errorMsg += ` started at ${templateName}:${sourceLine}`;
    }
  }

  return errorMsg;
}

export function unclosedAction(templateName, templateText, errorDetails) {
  let [_token, bounds, origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let sourceLine = getLine(templateText, origin[1]);

  let errorMsg = `unclosed action`;

  if (errorLine > 1) {
    errorMsg = `${templateName}:${errorLine}: ` + errorMsg;

    if (errorLine !== sourceLine) {
      errorMsg += ` started at ${templateName}:${sourceLine}`;
    }
  }

  return errorMsg;
}

export function unexpectedAction(templateName, templateText, errorDetails) {
  let [token, bounds, origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let sourceLine = getLine(templateText, origin[1]);

  let errorMsg = `unexpected ${token.originalText}`;

  if (errorLine > 1) {
    errorMsg = `${templateName}:${errorLine}: ` + errorMsg;

    if (errorLine !== sourceLine) {
      errorMsg += ` started at ${templateName}:${sourceLine}`;
    }
  }

  return errorMsg;
}

export function unexpectedFlowControlToken(
  templateName,
  templateText,
  errorDetails,
) {
  let [token, bounds, origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let sourceLine = getLine(templateText, origin[1]);

  let errorMsg = `${token.originalText} outside {{range}}`;

  if (errorLine > 1) {
    errorMsg = `${templateName}:${errorLine}: ` + errorMsg;

    if (errorLine !== sourceLine) {
      errorMsg += ` started at ${templateName}:${sourceLine}`;
    }
  }

  return errorMsg;
}

export function unexpectedTokenInAction(
  templateName,
  templateText,
  errorDetails,
) {
  let [token, bounds, origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let sourceLine = getLine(templateText, origin[1]);

  let errorMsg = `unexpected <${token.firstArg}> in ${token.text}`;

  if (errorLine > 1) {
    errorMsg = `${templateName}:${errorLine}: ` + errorMsg;

    if (errorLine !== sourceLine) {
      errorMsg += ` started at ${templateName}:${sourceLine}`;
    }
  }

  return errorMsg;
}

export function unexpectedTokenInClause(
  templateName,
  templateText,
  errorDetails,
) {
  let [token, bounds, origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let sourceLine = getLine(templateText, origin[1]);

  let errorMsg = `unexpected "${token.firstArg}" in ${token.text} clause`;

  // TODO: Shall we check if there is a single template?
  // if (errorLine > 1) {
  errorMsg = `${templateName}:${errorLine}: ` + errorMsg;

  if (errorLine !== sourceLine) {
    errorMsg += ` started at ${templateName}:${sourceLine}`;
  }
  // }

  return errorMsg;
}

export function unexpectedTokenInCommand(
  templateName,
  templateText,
  errorDetails,
) {
  let [token, bounds, origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let sourceLine = getLine(templateText, origin[1]);

  let errorMsg = `unexpected <${token.text}> in command`;

  if (errorLine > 1) {
    errorMsg = `${templateName}:${errorLine}: ` + errorMsg;

    if (errorLine !== sourceLine) {
      errorMsg += ` started at ${templateName}:${sourceLine}`;
    }
  }

  return errorMsg;
}
