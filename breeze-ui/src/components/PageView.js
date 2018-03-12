import React from 'react'
import './PageView.css'
import './PageCommon.css'
import Text from '../containers/Text'
import { editMethod } from '../reducers/pages'

class PageView extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.save = this.save.bind(this);
    this.create = this.create.bind(this);
  }

  showEditButton() {
    if (this.props.editMethod !== editMethod.DISABLED) {
      return (
        <div className="page-title-button-wrapper">
          <button className="btn btn-link disabled page-title-button">
            <span className="glyphicon glyphicon-pencil"></span>
          </button>
          <button className="btn btn-link disabled page-title-button">
            <span className="glyphicon glyphicon-time"></span>
          </button>
        </div>
      );
    }
    return (
      <div className="page-title-button-wrapper">
        <button className="btn btn-link page-title-button" onClick={ () => this.props.startEditing(editMethod.FULL, null, null, null) }>
          <span className="glyphicon glyphicon-pencil"></span>
        </button>
        <button className="btn btn-link page-title-button" onClick={ () => this.props.showHistory(this.props.pageId) }>
          <span className="glyphicon glyphicon-time"></span>
        </button>
        <button className="btn btn-link page-title-button" onClick={this.props.showAccountInfo}>
          <span className="glyphicon glyphicon-user"></span>
        </button>
      </div>
    );
  }

  showPage() {
    return (
      <div>
        <div className="page-title-wrapper">
          <h1 className="page-title">
            { this.props.page.title }
            { this.showEditButton() }
          </h1>
        </div>
        <div>
          <Text></Text>
        </div>
      </div>
    )
  }

  editPage() {
    // todo: try using form component
    return (
      <div>
        <div className="page-title-wrapper">
          <h1>Edit: { this.props.page.title }</h1>
        </div>
        <form>
          <div className="form-group">
            <textarea className="form-control" rows="15" value={ this.props.newText } onChange={ this.handleChange }></textarea>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-default" onClick={ this.props.stopEditing }>Cancel</button>
            <button type="button" className="btn btn-success save-page-button" onClick={ this.save }>Save</button>
          </div>
        </form>
      </div>
    )
  }

  createPage() {
    return (
      <div>
        <div className="page-title-wrapper">
          <h1>Create new page</h1>
        </div>
        <form>
          <div className="form-group">
            <input type="text" className="form-control" value={ this.props.newTitle } onChange={ this.handleTitleChange }></input>
          </div>
          <div className="form-group">
            <textarea className="form-control" rows="15" value={ this.props.newText } onChange={ this.handleChange }></textarea>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-success" onClick={ this.create }>Create</button>
          </div>
        </form>
      </div>
    )
  }

  showLoadingProcess() {
    return (
      <div>
        <h1>Loading Page...</h1>
      </div>
    )
  }

  handleChange(e) {
    this.props.updateEditedText(e.target.value);
  }

  handleTitleChange(e) {
    this.props.updateEditedTitle(e.target.value);
  }

  save(e) {
    this.props.stopEditing();
    this.props.updatePage(this.props.page.id, this.props.page.diff_id, this.props.newText);
  }

  create(e) {
    this.props.createPage(this.props.newTitle, this.props.newText);
  }

  render() {
    if (this.props.page) {
      if (this.props.editMethod === editMethod.FULL) {
        return this.editPage();
      }
      else {
        return this.showPage();
      }
    }
    else {
      if (this.props.isNew) {
        return this.createPage();
      }
      else {
        return this.showLoadingProcess();
      }
    }
  }

}

export default PageView
