import {
  TOKEN_NEW_LINE,
  TOKEN_WORD,
  TOKEN_SPACE,
  TOKEN_UNKNOWN,
  getNewLineTokens,
  getLinkStartTokens,
  getLinkEndTokens,
  getWordTokens,
  getSpaceTokens,
  splitBaseTokens,
  baseTokensToTextLines,
  textLinesToParagraphSeparators,
} from './parser';
import parse from './parser';

test('getNewLineTokens', () => {
  expect(getNewLineTokens('').length).toBe(0);
  expect(getNewLineTokens('aaa').length).toBe(1);
  expect(getNewLineTokens('a\naa').length).toBe(3);
  let tokens = getNewLineTokens('a\naa');
  expect(tokens[0].text).toBe('a');
  expect(tokens[1].text).toBe('\n');
  expect(tokens[1].type).toBe(TOKEN_NEW_LINE);
  expect(tokens[2].text).toBe('aa');
});

test('getLinkStartTokens', () => {
  expect(getLinkStartTokens('').length).toBe(0);
  expect(getLinkStartTokens('aaa').length).toBe(1);
  expect(getLinkStartTokens('aaa--->').length).toBe(2);
  expect(getLinkStartTokens('--->ddd').length).toBe(2);
  expect(getLinkStartTokens('aaa--->ddd').length).toBe(3);
  expect(getLinkStartTokens('--->').length).toBe(1);
  let tokens = getLinkStartTokens('aaa--->ddd');
  expect(tokens[1].type).toBe(TOKEN_WORD);
  expect(tokens[1].text).toBe('--->');
});

test('getLinkEndTokens', () => {
  expect(getLinkEndTokens('').length).toBe(0);
  expect(getLinkEndTokens('aaa').length).toBe(1);
  expect(getLinkEndTokens('aaa<---').length).toBe(2);
  expect(getLinkEndTokens('<---ddd').length).toBe(2);
  expect(getLinkEndTokens('aaa<---ddd').length).toBe(3);
  expect(getLinkEndTokens('<---').length).toBe(1);
  let tokens = getLinkEndTokens('aaa<---ddd');
  expect(tokens[1].type).toBe(TOKEN_WORD);
  expect(tokens[1].text).toBe('<---');
});

test('getWordTokens', () => {
  let tokens = getWordTokens('a aa');
  expect(tokens[0].text).toBe('a');
  expect(tokens[0].type).toBe(TOKEN_WORD);
  expect(tokens[1].text).toBe(' ');
  expect(tokens[2].text).toBe('aa');
});

test('getSpaceTokens', () => {
  let tokens = getSpaceTokens('a aa');
  expect(tokens[0].text).toBe('a');
  expect(tokens[1].text).toBe(' ');
  expect(tokens[1].type).toBe(TOKEN_SPACE);
  expect(tokens[2].text).toBe('aa');
});

test('splitBaseTokens', () => {
  let tokens = splitBaseTokens('a aa');
  expect(tokens.length).toBe(3);
  tokens = splitBaseTokens('a \naa');
  expect(tokens.length).toBe(4);
});

test('baseTokensToTextLines', () => {
  let tokens = splitBaseTokens('a\naa');
  tokens = baseTokensToTextLines(tokens);
  expect(tokens[1].nested.length).toBe(1);
  expect(tokens.length).toBe(2);
  expect(tokens[0].text).toBe('a\n');
  expect(tokens[1].text).toBe('aa');
  tokens = splitBaseTokens('\n\naa');
  expect(tokens.length).toBe(3);
});

test('textLinesToParagraphSeparators', () => {
  let tokens = textLinesToParagraphSeparators(
    baseTokensToTextLines(
      splitBaseTokens('\n   \n\n')
    )
  );
  expect(tokens.length).toBe(3);

  tokens = textLinesToParagraphSeparators(
    baseTokensToTextLines(
      splitBaseTokens('aaaa\n   \n\n')
    )
  );
  expect(tokens.length).toBe(2);
  expect(tokens[0].nested.length).toBe(2);

  tokens = textLinesToParagraphSeparators(
    baseTokensToTextLines(
      splitBaseTokens('aaaa\n   \n\nbbb\n')
    )
  );
  expect(tokens.length).toBe(3);
  expect(tokens[0].nested.length).toBe(2);

  tokens = textLinesToParagraphSeparators(
    baseTokensToTextLines(
      splitBaseTokens('aaa ddd \n   \n\n  \n  dddd')
    )
  );
  expect(tokens.length).toBe(3);
});

test('parse', () => {
  let tree = parse('aaa');
  expect(tree.nested.length).toBe(1);
  expect(tree.nested[0].nested[0].type).toBe('paragraph');

  tree = parse('aaa\n\n# title 1\nbbb\n\nccc');
  expect(tree.nested.length).toBe(1);
  expect(tree.nested[0].get('tilte')).toBe(null);

  tree = parse('aaa\n\n# title 1\n\nbbb\n\nccc\n\n# title 2');
  expect(tree.nested.length).toBe(3);
  expect(tree.nested[0].get('title')).toBe(null);
  expect(tree.nested[0].nested[0].text).toBe('aaa\n\n');
  expect(tree.nested[1].get('title')).toBe('title 1');
  expect(tree.nested[1].nested[0].text).toBe('# title 1\n\n');
  expect(tree.nested[1].nested[1].text).toBe('bbb\n\n');
  expect(tree.nested[1].nested[2].text).toBe('ccc\n\n');
  expect(tree.nested[2].get('title')).toBe('title 2');
  expect(tree.nested[2].nested[0].text).toBe('# title 2');

  tree = parse('aaa\n\n# title 1\n\nbbb\n\n## title 1.1\n\nccc\n\n# title 2');
  expect(tree.nested.length).toBe(3);
  expect(tree.nested[1].nested[2].type).toBe('section');
  expect(tree.nested[1].nested[2].props.get('title')).toBe('title 1.1');
  expect(tree.nested[1].nested[2].nested.length).toBe(2);
  expect(tree.nested[1].nested[2].nested[0].type).toBe('title');
  expect(tree.nested[1].nested[2].nested[1].type).toBe('paragraph');

  tree = parse('--->link_text');
  expect(tree.nested[0].nested[0].nested[0].nested[0].type).toBe('link');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('page_title')).toBe('link_text');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('text')).toBe('link text');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('is_short')).toBe(true);

  tree = parse('---> link_text');
  expect(tree.nested[0].nested[0].nested[0].nested[0].type).toBe('link');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('page_title')).toBe('link_text');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('text')).toBe('link text');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('is_short')).toBe(true);

  tree = parse('---> link text<---');
  expect(tree.nested[0].nested[0].nested[0].nested[0].type).toBe('link');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('text')).toBe('link text');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('is_short')).toBe(false);

  tree = parse('# title 1\n\nsome text ---> link text<---');
  expect(tree.nested[0].nested[1].nested[0].nested[4].type).toBe('link');
  expect(tree.nested[0].nested[1].nested[0].nested[4].text).toBe('---> link text<---');
  expect(tree.nested[0].nested[1].nested[0].nested[4].get('text')).toBe('link text');

  tree = parse('https://url.com');
  expect(tree.nested[0].nested[0].nested[0].nested[0].type).toBe('url');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('text')).toBe('url.com');
  expect(tree.nested[0].nested[0].nested[0].nested[0].get('url')).toBe('https://url.com');

  tree = parse('');
  expect(tree.nested).toBe(null);
});
