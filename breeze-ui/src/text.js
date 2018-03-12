
export function truncateLeft(text, length) {
  if (length <= 3) {
    length = 4;
  }
  if (text.length <= length) {
    return text;
  }
  text = text.slice(text.length-length+3);
  text = '...' + text;
  return text
}

export function truncateMiddle(text, length) {
  if (length <= 4) {
    length = 5;
  }
  if (text.length <= length) {
    return text;
  }
  let halfLength = Math.floor((length-3)/2);
  let resultText = text.slice(0, halfLength);
  resultText += '...'
  resultText += text.slice(text.length-halfLength);
  return resultText;
}

