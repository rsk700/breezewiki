import React from 'react'

class TextBlockEditorView extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }

  render() {
    return (
        <form>
          <div className="form-group">
            <textarea className="form-control" rows="10" value={ this.props.newText } onChange={ this.handleChange }></textarea>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-default" onClick={ this.props.stopEditing }>Cancel</button>
            <button type="button" className="btn btn-success save-page-button" onClick={ this.save }>Save</button>
          </div>
        </form>
    );
  }

  handleChange(e) {
    this.props.updateEditedText(e.target.value);
  }

  save() {
    this.props.stopEditing();
    let newText = this.props.page.text.slice(0, this.props.start);
    newText += this.props.newText;
    newText += this.props.page.text.slice(this.props.end);
    this.props.updatePage(this.props.page.id, this.props.page.diff_id, newText);
  }

}

export default TextBlockEditorView;
