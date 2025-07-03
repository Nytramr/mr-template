export function getLine(text, position) {
  return text.slice(0, position).split('\n').length;
}
