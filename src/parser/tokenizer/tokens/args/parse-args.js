import {
  BOOL_TYPE,
  NIL_TYPE,
  NUMBER_TYPE,
  UNKNOWN_TYPE,
  VALUE_TYPE,
  VARIABLE_TYPE,
} from '../../../../constants';
import { getMatchObject } from '../../utils';

const SPLIT_PIPELINE_STRING_REGEX =
  /\s*((?<string>""|``|`(?:[^`]+)`?|"(?:\\"|[^"])+"?)|(?<char>'(?:\\'|[^'])+'?)|(?<symbol>[|,])|(?<assign>:?=)|(?<paren>[()])|(?<unknown>[^\s()|:,=]+))/dgm;

const TOKEN_TYPES = [
  [NUMBER_TYPE, /^[-+]?[0-9]/],
  [VARIABLE_TYPE, /^\$/],
  [VALUE_TYPE, /^\./],
  [BOOL_TYPE, /^(true|false)/],
  [NIL_TYPE, /^nil/],
];

function inferType(text) {
  let tuple = TOKEN_TYPES.find(([_, regexp]) => regexp.test(text));
  return tuple ? tuple[0] : UNKNOWN_TYPE;
}

export function parseArgs(args) {
  if (args) {
    const matches = Array.from(
      args.text.matchAll(SPLIT_PIPELINE_STRING_REGEX),
    ).flatMap((match) => {
      let { groups, indices } = JSON.parse(
        JSON.stringify({ groups: match.groups, indices: match.indices.groups }),
      );

      return Object.entries(groups).map(([key, text]) => {
        let type = key;
        if (key === UNKNOWN_TYPE) {
          type = inferType(text);
        }
        return {
          ...getMatchObject(text, ...indices[key], args.start),
          type,
        };
      });
    });

    return matches;
  }

  return [];
}
