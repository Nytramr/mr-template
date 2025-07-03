import { getLine } from './utils';

export const FUNCTION_NOT_DEFINED = 'function not defined';

export function functionNotDefined(templateName, templateText, errorDetails) {
  let [_token, bounds] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let functionName = templateText.slice(...bounds);

  let errorMsg = '';

  if (errorLine > 1) {
    errorMsg += `${templateName}:${errorLine}: `;
  }

  return `${errorMsg}function "${functionName}" not defined`;
}
