import React from 'react'
import _ from 'lodash'
import './DiffView.css'
import { truncateLeft, truncateMiddle } from '../text'

function showDiffToken(changeType, text, key) {
  let lines = text.split(/\n/);
  let html = _(lines).slice(0, lines.length-1).map((line, index) => {
    return [
      <span key={ index }>{ line }</span>,
      <br key={ 'br' + index.toString() }/>
    ];
  }).value();
  let htmlEnd = _(lines).slice(lines.length-1).map((line, index) => {
    return (
      <span key={ index }>{ line }</span>
    );
  }).value();
  html = html.concat(htmlEnd);
  if (changeType === 0) {
    return <span key={ key }>{ html }</span>;
  }
  else if (changeType === 1) {
    return <span className="diff-add" key={ key }>{ html }</span>;
  }
  else if (changeType === -1) {
    return <span className="diff-remove" key={ key }>{ html }</span>;
  }
}

function showDiffText(diff) {
  let html = [];
  let posStart;
  let posEnd;
  let keyCounter = 0;
  let nextKey = () => {
    keyCounter += 1;
    return keyCounter;
  };
  // posStart = _.findIndex(diff, d => d[0] !== 0);
  posStart = _.findIndex(diff, (d, i) => {
    return d[0] !== 0;
  });
  posEnd = _(diff.concat([])).reverse().findIndex(d => d[0] !== 0);
  posEnd = diff.length - posEnd;
  if (posStart > 0) {
    let startText = truncateLeft(diff[posStart-1][1], 40);
    html.push(showDiffToken(diff[posStart-1][0], startText, nextKey()));
  }
  _.slice(diff, posStart, posEnd).forEach(d => {
    let text = d[1];
    if (d[0] === 0) {
      text = truncateMiddle(text, 80);
    }
    html.push(showDiffToken(d[0], text, nextKey()));
  });
  if (posEnd < diff.length) {
    let endText = _.truncate(diff[posEnd][1], {length: 40});
    html.push(showDiffToken(diff[posEnd][0], endText, nextKey()));
  }
  return html;
}

const DiffView = ({diff}) => {
  return (
    <div>
      { showDiffText(diff) }
    </div>
  )
};

export default DiffView;
