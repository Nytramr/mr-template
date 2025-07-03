import { getLine } from './utils';

export const UNCLOSED_COMMENT_ERROR = 'unclosed comment';

export function unclosedComment(templateName, templateText, errorDetails) {
  let [_token, bounds, _origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);

  let errorMsg = `${templateName}:${errorLine}: unclosed comment`;

  return errorMsg;
}
