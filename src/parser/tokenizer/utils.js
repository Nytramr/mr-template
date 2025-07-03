export function getMatch(inputText, start, end) {
  let text = inputText.slice(start, end);

  return (
    text && {
      text,
      start,
      end,
    }
  );
}

export function getMatchObject(text, start, end, offset = 0) {
  return {
    text,
    start: start + offset,
    end: end + offset,
  };
}

function getMatchDetails(match) {
  if (match.groups) {
    return {
      groups: match.groups,
      indices: match.indices.groups,
    };
  }
  return {
    groups: Array.from(match),
    indices: match.indices,
  };
}

export function hashMatch(match, offset = 0) {
  if (match) {
    let details = getMatchDetails(match);
    let result = Object.fromEntries(
      Object.entries(details.groups)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => {
          let [start, end] = details.indices[key];
          return [
            key,
            { text: value, start: start + offset, end: end + offset },
          ];
        }),
    );

    result._originalText = match[0];

    return result;
  }
  console.log('no match');
  return {};
}

export function* splitTextToMatches(inputText, regExp) {
  let lastIndex = 0;
  const matches = inputText.matchAll(regExp);

  for (let match of matches) {
    let _unknown = getMatch(inputText, lastIndex, match.index);
    if (_unknown.text) {
      yield { _unknown };
    }
    yield hashMatch(match);
    lastIndex = match.indices[0][1];
  }

  if (lastIndex < inputText.length) {
    yield { _unknown: getMatch(inputText, lastIndex, inputText.length) };
  }
}
