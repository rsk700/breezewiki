import React from 'react'
import './TextView.css'
import './PageCommon.css'
import _ from 'lodash'
import Link from '../containers/Link'
import TextBlockEditor from '../containers/TextBlockEditor'
import parse from '../parser'
import { TOKEN_PARAGRAPH, TOKEN_SECTION, TOKEN_PARAGRAPH_TEXT_LINE, TOKEN_LINK, TOKEN_URL } from '../parser'

class TextView extends React.Component {

  // key used for text blocks, it has unique value, so all text get rerendered
  // always
  uniquekey = 0

  getKey() {
    let current = this.uniquekey;
    this.uniquekey += 1;
    return current;
  }

  startBlockEditing(e, tokenType, start, end) {
    this.props.startBlockEditing(tokenType, start, end);
    e.preventDefault();
    e.stopPropagation();
  };

  showEditButton(token) {
    if (this.props.isEdit) {
      return (
        <div className="block-edit-button-wrapper">
          <button className="btn btn-link disabled block-edit-button">
            <span className="glyphicon glyphicon-pencil"></span>
          </button>
        </div>
      );
    }
    return (
      <div className="block-edit-button-wrapper">
        <button className="btn btn-link block-edit-button" onClick={e => this.startBlockEditing(e, token.type, token.start, token.end)}>
          <span className="glyphicon glyphicon-pencil"></span>
        </button>
      </div>
    );
  }

  formatSectionTitle(section) {
    let level = section.props.get('level');
    let title = section.props.get('title');
    if (level === 1) {
      return (
        <div key={this.getKey()}>
          <h1 id={title} key={this.getKey()}>
            { this.showEditButton(section) }
            <a href={'#' + title} key={this.getKey()} onClick={e => e.preventDefault()}>{ title }</a>
          </h1>
        </div>
      );
    }
    else if (level === 2) {
      return (
        <div key={this.getKey()}>
          <h2 id={title} key={this.getKey()}>
            { this.showEditButton(section) }
            <a href={'#' + title} key={this.getKey()} onClick={e => e.preventDefault()}>{ title }</a>
          </h2>
        </div>
      );
    }
    else if (level === 3) {
      return (
        <div key={this.getKey()}>
          <h3 id={title} key={this.getKey()}>
            { this.showEditButton(section) }
            <a href={'#' + title} key={this.getKey()} onClick={e => e.preventDefault()}>{ title }</a>
          </h3>
        </div>
      );
    }
    else if (level === 4) {
      return (
        <div key={this.getKey()}>
          <h4 id={title} key={this.getKey()}>
            { this.showEditButton(section) }
            <a href={'#' + title} key={this.getKey()} onClick={e => e.preventDefault()}>{ title }</a>
          </h4>
        </div>
      );
    }
    else if (level === 5) {
      return (
        <div key={this.getKey()}>
          <h5 id={title} key={this.getKey()}>
            { this.showEditButton(section) }
            <a href={'#' + title} key={this.getKey()} onClick={e => e.preventDefault()}>{ title }</a>
          </h5>
        </div>
      );
    }
  }

  formatTextLine(textLine) {
    let tokens = textLine.nested;
    let text = '';
    let html = [];
    tokens.forEach((token, index) => {
      if (text.length > 0 && (token.type === TOKEN_LINK || token.type === TOKEN_URL)) {
        html.push(
          <span key={this.getKey()}>
            { text }
          </span>
        );
        text = '';
      }
      if (token.type === TOKEN_LINK) {
        html.push(
            <Link route="/page/:id" params={ {id: token.get('page_title')} } key={this.getKey()}>
              { token.get('text') }
            </Link>
        );
      }
      else if (token.type === TOKEN_URL){
        html.push(
          <a href={token.get('url')} key={this.getKey()}>{ token.get('text') }</a>,
        )
      }
      else {
        text += token.text;
      }
      if (index === (tokens.length - 1)) {
        if (text.length > 0) {
          html.push(
            <span key={this.getKey()}>
              { text }
            </span>
          );
        }
        html.push(<br key={this.getKey()} />);
      }
    });
    return html;
  }

  formatParagraph(paragraph) {
    if (this.props.isEdit && paragraph.type === this.props.editTokenType && paragraph.start === this.props.editStart) {
      return <TextBlockEditor key={this.getKey()}></TextBlockEditor>;
    }
    let textLines = _.filter(paragraph.nested, line => line.type === TOKEN_PARAGRAPH_TEXT_LINE);
    textLines = _.map(textLines, line => {
      return this.formatTextLine(line);
    });
    return (
      <div className="text-paragraph" key={this.getKey()}>
        { this.showEditButton(paragraph) }
        <p key={this.getKey()}>
          { textLines }
        </p>
      </div>
    );
  };

  formatSection(section) {
    let html = [];
    if (this.props.isEdit && section.type === this.props.editTokenType && section.start === this.props.editStart) {
      return <TextBlockEditor key={this.getKey()}></TextBlockEditor>;
    }
    if (section.has('title')) {
      html.push(this.formatSectionTitle(section));
    }
    let text = _.map(section.nested, token => {
      if (token.type === TOKEN_PARAGRAPH) {
        return this.formatParagraph(token);
      }
      else if (token.type === TOKEN_SECTION) {
        return this.formatSection(token);
      }
    });
    html = html.concat(text);
    return (
      <div key={this.getKey()}>
        { html }
      </div>
    );
  }

  render() {
    let articleTree = parse(this.props.text);
    if (articleTree.nested === null) {
      return (
        <div className="page-text text-center empty-notification">
          empty
        </div>
      );
    }
    let sections = _.map(articleTree.nested, section => this.formatSection(section));
    return (
      <div className="page-text">
        { sections }
      </div>
    );
  }
}

export default TextView;
