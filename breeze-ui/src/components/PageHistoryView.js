import React from 'react'
import './PageCommon.css'
import './PageHistoryView.css'
import DiffView from './DiffView'

class PageHistoryView extends React.Component {

  showDiffBlock(diff) {
    let date = new Date(diff.created_time);
    return (
      <div className="diff-block" key={ diff.id }>
        <div className="diff-create-time">
          { date.toString() }
        </div>
        <div className="diff-text-wrapper">
          <DiffView diff={diff.diff} />
        </div>
      </div>
    )
  }

  showHistory() {
    let history = [];
    if (this.props.history.length === 0 && this.props.isFetched) {
      return (
        <div className="page-text text-center empty-notification">
          no changes yet
        </div>
      )
    }
    this.props.history.forEach(diff => {
      history.push(this.showDiffBlock(diff));
    });
    return history;
  }

  showMoreButton() {
    if (!this.props.hasMoreHistory) {
      return null;
    }
    return (
      <div className="text-center more-diffs-wrapper">
        <button className="btn btn-success" onClick={() => this.props.getMoreHistory()}>Show more changes</button>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="page-title-wrapper">
          <h1 className="page-title">
            History: { this.props.page.title }
            <div className="page-title-button-wrapper">
              <button className="btn btn-link page-title-button" onClick={ () => this.props.showPage(this.props.page.id) }>
                <span className="glyphicon glyphicon-eye-open"></span>
              </button>
            </div>
          </h1>
        </div>
        <div>
          { this.showHistory() }
        </div>
        { this.showMoreButton() }
      </div>
    );
  }

}

export default PageHistoryView;
