import { LiteralToken, parseAction } from './tokens';
import { splitTextToMatches } from './utils';

// To separate a template between text literals and action sentences `{{- action -}}` or comments `{{- /* ... */ -}}`
export const SEPARATOR_REG_EX =
  /\{\{(?<pre>\-\s+)?(?:(?<comment>\/\*.*?)|(?<action>(?:(?:\\[{}]|[^{}])+?|)))(?<post>\s+\-)?\}\}/dgms;

export function splitInTokens(templateText) {
  if (!templateText) {
    return [];
  }

  let parts = splitTextToMatches(templateText, SEPARATOR_REG_EX);
  let lastLiteral;
  let applyPost;

  return Array.from(parts, (matches) => {
    if (matches._unknown) {
      lastLiteral = LiteralToken.fromMatch(matches._unknown);
      applyPost && lastLiteral.trimFromPost();
      return lastLiteral;
    }

    let { pre, post } = matches;

    // Trim white spaces helpers `{{- ... -}}`
    applyPost = post;
    pre && lastLiteral && lastLiteral.trimFromPre();
    lastLiteral = undefined;

    return parseAction(matches);
  });
}
