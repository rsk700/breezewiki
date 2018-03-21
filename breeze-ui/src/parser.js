import _ from 'lodash';

// base tokens
export const TOKEN_NEW_LINE = 'new_line';
export const TOKEN_WORD = 'word';
export const TOKEN_SPACE = 'space';
export const TOKEN_UNKNOWN = 'unknown';
export const TOKEN_TEXT_LINE = 'text_line';

// tree tokens
export const TOKEN_ARTICLE = 'article';
export const TOKEN_SECTION = 'section';
export const TOKEN_TITLE = 'title';
export const TOKEN_PARAGRAPH = 'paragraph';
export const TOKEN_PARAGRAPH_SEPARATOR = 'paragraph_separator';
export const TOKEN_PARAGRAPH_TEXT_LINE = 'paragraph_text_line';
export const TOKEN_LINK = 'link';
export const TOKEN_URL = 'url';
export const TOKEN_FORMATTED_TEXT = 'formatted_text';

export const LINK_START = '--->';
export const LINK_END = '<---';
export const FORMATTED_TEXT_MARK = '```';

let urlRe = /^(https?|ftp):\/\/([^\s]{3,1024})$/;

class TokenProperties {

  constructor() {
    this.props = {};
  }

  get(name) {
    if (this.props.hasOwnProperty(name)) {
      return this.props[name];
    }
    return null;
  }

  set(name, value) {
    this.props[name] = value;
    return this;
  }

  has(name) {
    return this.get(name) !== null;
  }

}

class Token {

  constructor(type, text, start, end) {
    this.type = type;
    this.text = text;
    this.start = start;
    this.end = end;
    // todo: probably for empty nested better always use empty array
    this.nested = null;
    this.props = new TokenProperties();
  }

  hasNested() {
    if (this.nested === null) {
      return false;
    }
    else if (this.nested.length > 0) {
      return true;
    }
    return false;
  }

  addNestedToken(token) {
    if (this.nested === null) {
      this.nested = [];
    }
    this.nested.push(token);
    return this;
  }

  nestTokens(tokens) {
    tokens.forEach(token => this.addNestedToken(token));
    return this;
  }

  get(name) {
    return this.props.get(name);
  }

  set(name, value) {
    this.props.set(name, value);
    return this;
  }

  has(name) {
    return this.props.has(name);
  }

}

class TokenExplorer {

  constructor(tokens) {
    this.tokens = tokens;
    this.index = 0;
  }

  clone() {
    let explorer = new TokenExplorer(this.tokens);
    explorer.index = this.index;
    return explorer;
  }

  token() {
    if (this.index >= this.tokens.length) {
      return null;
    }
    else {
      return this.tokens[this.index];
    }
  }

  nextToken() {
    let index = this.index + 1;
    if (index >= this.tokens.length) {
      return null;
    }
    else {
      return this.tokens[index];
    }
  }

  hasMoreTokens() {
    return this.token() !== null;
  }

  noMoreTokens() {
    return !this.hasMoreTokens();
  }

  isLastOrCheck(check) {
    if (this.nextToken() === null) {
      return true;
    }
    return check(this);
  }

  takeUntil(check) {
    let tokens = [];
    while (this.hasMoreTokens()) {
      if (check(this)) {
        break;
      }
      else {
        tokens.push(this.pop());
      }
    }
    return tokens;
  }

  takeWhile(check) {
    return this.takeUntil(_.negate(check));
  }

  pop() {
    let token = this.token();
    this.forward();
    return token;
  }

  forward() {
    this.index += 1;
    this.index = Math.min(this.index, this.tokens.length);
    return this;
  }

  exploreNested() {
    if (this.token() !== null) {
      if (this.token().nested !== null) {
        return new TokenExplorer(this.token().nested);
      }
    }
    return new TokenExplorer([]);
  }

  exploreFromHere() {
    let newExplorer = new TokenExplorer(this.tokens);
    newExplorer.index = this.index;
    return newExplorer;
  }

}

function splitBaseTokensWithParser(tokens, parser) {
  let newTokens = [];
  tokens.forEach(t => {
    if (t.type === TOKEN_UNKNOWN) {
      let tmpTokens = parser(t.text);
      newTokens = newTokens.concat(tmpTokens);
    }
    else {
      newTokens = newTokens.concat(t);
    }
  });
  return newTokens;
}

export function splitBaseTokens(text) {
  let tokens = [new Token(TOKEN_UNKNOWN, text, null, null)];
  tokens = splitBaseTokensWithParser(tokens, getNewLineTokens);
  tokens = splitBaseTokensWithParser(tokens, getLinkStartTokens);
  tokens = splitBaseTokensWithParser(tokens, getLinkEndTokens);
  tokens = splitBaseTokensWithParser(tokens, getWordTokens);
  tokens = splitBaseTokensWithParser(tokens, getSpaceTokens);
  let index = 0;
  tokens.forEach(token => {
    token.start = index;
    token.end = index + token.text.length;
    index += token.text.length;
  });
  return tokens;
}

export function getTokens(tokenName, re, text) {
  let tokens = [];
  let index = text.search(re);
  while (index !== -1) {
    let startText = text.substring(0, index);
    let endText = text.substring(index);
    let token = endText.match(re)[0];
    text = endText.substring(token.length);
    tokens.push(new Token(TOKEN_UNKNOWN, startText, null, null));
    tokens.push(new Token(tokenName, token, null, null));
    index = text.search(re);
  }
  tokens.push(new Token(TOKEN_UNKNOWN, text, null, null));
  tokens = _.filter(tokens, t => t.text.length > 0);
  return tokens;
}

export function getNewLineTokens(text) {
  return getTokens(TOKEN_NEW_LINE, /\r?\n/, text);
}

export function getLinkStartTokens(text) {
  let re = new RegExp(LINK_START);
  return getTokens(TOKEN_WORD, re, text);
}

export function getLinkEndTokens(text) {
  let re = new RegExp(LINK_END);
  return getTokens(TOKEN_WORD, re, text);
}

export function getWordTokens(text) {
  return getTokens(TOKEN_WORD, /\S+/, text);
}

export function getSpaceTokens(text) {
  return getTokens(TOKEN_SPACE, /\s+/, text);
}

function tokenFromTokens(tokens, newTokenType, nest) {
  let text = '';
  tokens.forEach(token => { text += token.text });
  let newToken = new Token(newTokenType, text, tokens[0].start, tokens[tokens.length-1].end);
  if (nest) {
    newToken.nestTokens(tokens);
  }
  return newToken;
}

export function baseTokensToTextLines(tokens) {
  let textLines = [];
  let line = [];
  tokens.forEach(token => {
    line.push(token);
    if (token.type === TOKEN_NEW_LINE) {
      textLines.push(tokenFromTokens(line, TOKEN_TEXT_LINE, true));
      line = [];
    }
  });
  if (line.length !== 0) {
    textLines.push(tokenFromTokens(line, TOKEN_TEXT_LINE, true));
  }
  return textLines;
}

function textLineIsNewLine(textLine) {
  if (textLine.nested === null) {
    return false;
  }
  if (textLine.nested.length === 0) {
    return false;
  }
  if (textLine.nested.length === 1 && textLine.nested[0].type === TOKEN_NEW_LINE) {
    return true;
  }
  let isNewLineWithSpaces = (
    textLine.nested.length === 2 &&
    textLine.nested[0].type === TOKEN_SPACE &&
    textLine.nested[1].type === TOKEN_NEW_LINE
  );
  if (isNewLineWithSpaces) {
    return true;
  }
  return false;
}

export function textLinesToParagraphSeparators(tokens) {
  let explorer = new TokenExplorer(tokens);
  let newTokens = [];
  let checkIsNewLine = e => textLineIsNewLine(e.token());
  if (!explorer.hasMoreTokens()) {
    return newTokens;
  }
  // edge case if text starts with new line
  if (checkIsNewLine(explorer)) {
    // take all leading new lines and append without changes
    newTokens = newTokens.concat(explorer.takeUntil(_.negate(checkIsNewLine)));
  }
  while (explorer.token() !== null) {
    // take all lines which is not considered new lines
    newTokens = newTokens.concat(explorer.takeUntil(checkIsNewLine));
    if (explorer.noMoreTokens()) {
      break;
    }
    // take all next lines which is considered new lines and build separator
    // from it
    let separator = explorer.takeUntil(_.negate(checkIsNewLine));
    newTokens.push(tokenFromTokens(separator, TOKEN_PARAGRAPH_SEPARATOR, false));
  }
  return newTokens;
}

function textLineIsTitle(token) {
  return getTitleLevel(token) !== null;
}

function getTitleLevel(token) {
  if (token.type !== TOKEN_TEXT_LINE) {
    return null;
  }
  if (!token.hasNested()) {
    return null;
  }
  if (token.nested.length < 2) {
    return null;
  }
  let titleMatch = token.nested[0].text.match(/^#{1,5}$/);
  if (titleMatch !== null) {
    if (getTitle(token).length === 0) {
      return null;
    }
    return titleMatch[0].length;
  }
  return null;
}

function getTitle(token) {
  let explorer = new TokenExplorer(token.nested);
  explorer.pop();
  let title = '';
  while (explorer.hasMoreTokens()) {
    title += explorer.pop().text;
  }
  return title.trim();
}

function checkWordOrSpace(explorer) {
  if (explorer.token().type === TOKEN_WORD || explorer.token().type === TOKEN_SPACE) {
    return true;
  }
  return false;
}

function isLinkStart(explorer) {
  explorer = new TokenExplorer(explorer.clone().takeWhile(checkWordOrSpace));
  if (!explorer.hasMoreTokens()) {
    return false;
  }
  if (explorer.token().type !== TOKEN_WORD) {
    return false;
  }
  if (explorer.token().text !== LINK_START) {
    return false;
  }
  explorer.forward();
  if (!explorer.hasMoreTokens()) {
    return false;
  }
  if (explorer.token().type === TOKEN_SPACE) {
    explorer.forward();
  }
  if (!explorer.hasMoreTokens()) {
    return false;
  }
  if (explorer.token().type === TOKEN_WORD) {
    return true;
  }
  return false;
}

function isLinkEnd(explorer) {
  if (explorer.token().type === TOKEN_WORD && explorer.token().text === LINK_END) {
    return true;
  }
  return false;
}

function hasLinkEnd(explorer) {
  explorer = new TokenExplorer(explorer.clone().takeWhile(checkWordOrSpace));
  while (explorer.hasMoreTokens()) {
    if (isLinkEnd(explorer)) {
      return true;
    }
    explorer.forward();
  }
  return false;
}

function processInternalLink(explorer) {
  // link formats:
  // one word link (short format) "---> link_text"
  // multiple words, wrapped link "---> link text <---"
  let startTokens = [explorer.pop()];
  let endTokens = [];
  let textTokens = [];
  let isShort;
  if (hasLinkEnd(explorer)) {
    isShort = false;
    textTokens = explorer.takeUntil(isLinkEnd);
    endTokens = [explorer.pop()];
  }
  else {
    isShort = true;
    startTokens = startTokens.concat(explorer.takeUntil(e => e.token().type === TOKEN_WORD));
    textTokens = [explorer.pop()];
  }
  let linkText = '';
  textTokens.forEach(token => linkText += token.text);
  linkText = linkText.trim();
  let link = tokenFromTokens(_.concat(startTokens, textTokens, endTokens), TOKEN_LINK, true);
  link.set('is_short', isShort);
  link.set('page_title', linkText);
  if (isShort) {
    link.set('text', linkText.replace(/_/g, ' '));
  }
  else {
    link.set('text', linkText);
  }
  return link;
}

function isUrl(explorer) {
  if (explorer.token().type !== TOKEN_WORD) {
    return false;
  }
  if (explorer.token().text.search(urlRe) === 0) {
    return true;
  }
  return false;
}

function processUrl(explorer) {
  let token = explorer.pop();
  let url = token.text;
  let text = token.text.match(urlRe)[2];
  let urlToken = new Token(
    TOKEN_URL,
    token.text,
    token.start,
    token.end,
  );
  urlToken.set('url', url);
  urlToken.set('text', text);
  return urlToken;
}

function processParagraphTextLine(explorer) {
  let nested = [];
  let textLine = explorer.pop();
  explorer = new TokenExplorer(textLine.nested);
  while (explorer.hasMoreTokens()) {
    if (isLinkStart(explorer)) {
      nested.push(processInternalLink(explorer));
    }
    else if (isUrl(explorer)) {
      nested.push(processUrl(explorer));
    }
    else {
      nested.push(explorer.pop());
    }
  }
  return tokenFromTokens(nested, TOKEN_PARAGRAPH_TEXT_LINE, true);
}

function isFormattedTextEnd(explorer) {
  let lineExplorer = new TokenExplorer(explorer.token().nested);
  if (lineExplorer.noMoreTokens()) {
    return false;
  }
  let checkLine = (
    lineExplorer.token().text === FORMATTED_TEXT_MARK &&
    lineExplorer.isLastOrCheck(e => e.nextToken().type === TOKEN_NEW_LINE)
  );
  return (
    checkLine &&
    explorer.token().type === TOKEN_TEXT_LINE &&
    explorer.isLastOrCheck(e => e.nextToken().type === TOKEN_PARAGRAPH_SEPARATOR)
  );
}

function isFormattedText(explorer) {
  explorer = explorer.exploreFromHere();
  let check = (
    explorer.token().type === TOKEN_TEXT_LINE &&
    explorer.token().nested.length === 2 &&
    explorer.token().nested[0].text === FORMATTED_TEXT_MARK &&
    explorer.token().nested[1].type === TOKEN_NEW_LINE
  );
  if (!check) {
    return false;
  }
  explorer.pop();
  while (explorer.hasMoreTokens()) {
    if (isFormattedTextEnd(explorer)) {
      return true;
    }
    explorer.pop();
  }
  return false;
}

function processFormattedText(explorer) {
  let nested = [];
  nested.push(explorer.pop());
  while (!isFormattedTextEnd(explorer)) {
    nested.push(explorer.pop());
  }
  nested.push(explorer.pop());
  let token = tokenFromTokens(nested, TOKEN_FORMATTED_TEXT, true);
  let text = _(nested).slice(1, -1).reduce((text, token) => text + token.text, '');
  // removes end new line which always before end of formatted text mark
  text = text.slice(0, -1);
  token.set('text', text);
  return token;
}

function processParagraph(explorer) {
  let nested = [];
  while (explorer.hasMoreTokens()) {
    if (explorer.token().type === TOKEN_PARAGRAPH_SEPARATOR) {
      nested.push(explorer.pop());
      break;
    }
    else if (isFormattedText(explorer)) {
      nested.push(processFormattedText(explorer));
    }
    else if (explorer.token().type === TOKEN_TEXT_LINE) {
      nested.push(processParagraphTextLine(explorer));
    }
    else {
      // unknown token, saving as is
      nested.push(explorer.pop());
    }
  }
  let paragraph = tokenFromTokens(nested, TOKEN_PARAGRAPH, true);
  return paragraph;
}

function processTitle(explorer) {
  let nested = [];
  nested.push(explorer.pop());
  if (explorer.hasMoreTokens()) {
    nested.push(explorer.pop());
  }
  let title = tokenFromTokens(nested, TOKEN_TITLE, true);
  return title;
}

function isNextSeparatorOrEnd(explorer) {
  let nextSeparatorOrEnd;
  if (explorer.nextToken() === null) {
    nextSeparatorOrEnd = true;
  }
  else if (explorer.nextToken().type === TOKEN_PARAGRAPH_SEPARATOR) {
    nextSeparatorOrEnd = true;
  }
  else {
    nextSeparatorOrEnd = false;
  }
  return nextSeparatorOrEnd;
}

function processSection(level, explorer) {
  let title = null;
  let sections = [];
  let nested = [];
  if (!explorer.hasMoreTokens()) {
    return sections;
  }
  if (textLineIsTitle(explorer.token()) && isNextSeparatorOrEnd(explorer)) {
    title = getTitle(explorer.token());
    nested.push(processTitle(explorer));
  }
  while (explorer.hasMoreTokens()) {
    if (textLineIsTitle(explorer.token()) && isNextSeparatorOrEnd(explorer)) {
      let nextLevel = getTitleLevel(explorer.token());
      if (nextLevel > level) {
        nested = nested.concat(processSection(level + 1, explorer));
        continue;
      }
      else if (nextLevel === level) {
        let section = tokenFromTokens(nested, TOKEN_SECTION, true);
        section
          .set('title', title)
          .set('level', level)
          ;
        sections.push(section);
        nested = [];
        title = getTitle(explorer.token());
        nested.push(processTitle(explorer));
      }
      else {
        break;
      }
    }
    else {
      nested.push(processParagraph(explorer));
    }
  }
  let section = tokenFromTokens(nested, TOKEN_SECTION, true);
  section
    .set('title', title)
    .set('level', level)
    ;
  sections.push(section);
  return sections;
}

export default function parse(text) {
  // result structure:
  //  article
  //    section (section can has title)
  //      title
  //      paragraph
  //      section
  //
  //  paragraph
  //    formatted_text
  //    paragraph_text_line
  //      text
  //      link
  //      url
  let articleTree = new Token(TOKEN_ARTICLE, text, 0, text.length);
  let tokens = splitBaseTokens(text);
  tokens = baseTokensToTextLines(tokens);
  tokens = textLinesToParagraphSeparators(tokens);
  let explorer = new TokenExplorer(tokens);
  articleTree.nestTokens(processSection(1, explorer));
  return articleTree;
}
