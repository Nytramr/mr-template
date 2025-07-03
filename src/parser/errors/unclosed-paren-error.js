import { getLine } from './utils';

export const EMPTY_PIPELINE_ERROR = 'missing value for parenthesized pipeline';
export const UNCLOSED_PAREN_ERROR = 'unclosed paren';

export function unclosedParen(templateName, templateText, errorDetails) {
  const [_token, bounds, _origin] = errorDetails;
  const errorLine = getLine(templateText, bounds[1]);
  const leftParen = templateText.charAt(bounds[0]) === '(';

  let errorMsg = leftParen ? 'unclosed left paren' : 'unexpected right paren';

  if (errorLine > 1) {
    errorMsg = `${templateName}:${errorLine}: ` + errorMsg;
  }

  return errorMsg;
}
