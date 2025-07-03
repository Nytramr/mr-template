import { getLine } from './utils';

export const MULTIPLE_DEFINITIONS_FOR_TEMPLATE_ERROR =
  'multiple definitions for template';

export function multipleDefinitionsForTemplate(
  templateName,
  templateText,
  errorDetails,
) {
  let [token, bounds, origin] = errorDetails;
  let errorLine = getLine(templateText, bounds[1]);
  let sourceLine = getLine(templateText, origin[1]);

  let errorMsg = `template: multiple definition of template "${token.firstArg}"`;

  errorMsg = `${templateName}:${errorLine}: ` + errorMsg;

  if (errorLine !== sourceLine) {
    errorMsg += ` started at ${templateName}:${sourceLine}`;
  }

  return errorMsg;
}
