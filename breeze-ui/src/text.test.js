import { truncateLeft, truncateMiddle } from './text'

test('truncateLeft', () => {
  expect(truncateLeft('abcd', 3)).toBe('abcd');
  expect(truncateLeft('abcde', 3)).toBe('...e');
  expect(truncateLeft('', 5)).toBe('');
  expect(truncateLeft('a', 5)).toBe('a');
  expect(truncateLeft('ab', 5)).toBe('ab');
  expect(truncateLeft('abc', 5)).toBe('abc');
  expect(truncateLeft('abcd', 5)).toBe('abcd');
  expect(truncateLeft('abcd', 4)).toBe('abcd');
  expect(truncateLeft('abcde', 4)).toBe('...e');
  expect(truncateLeft('abcdef', 5)).toBe('...ef');
  expect(truncateLeft('abcdefg', 5)).toBe('...fg');
  expect(truncateLeft('abcdefg', 6)).toBe('...efg');
});

test('truncateMiddle', () => {
  expect(truncateMiddle('', 6)).toBe('');
  expect(truncateMiddle('a', 6)).toBe('a');
  expect(truncateMiddle('ab', 6)).toBe('ab');
  expect(truncateMiddle('abc', 6)).toBe('abc');
  expect(truncateMiddle('abcdef', 6)).toBe('abcdef');
  expect(truncateMiddle('abcdefg', 6)).toBe('a...g');
  expect(truncateMiddle('123456789', 8)).toBe('12...89');
  expect(truncateMiddle('abcdefg', 1)).toBe('a...g');
});
