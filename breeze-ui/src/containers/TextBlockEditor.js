import { connect } from 'react-redux'
import TextBlockEditorView from '../components/TextBlockEditorView'
import { getActivePage } from '../reducers/pages'
import { stopPageEditing, updateEditedText, updatePage } from '../actions/pages'

const mapStateToProps = state => {
  let page = getActivePage(state);
  return {
    page: page,
    start: state.pages.activePage.editedBlock.start,
    end: state.pages.activePage.editedBlock.end,
    newText: state.pages.activePage.newText,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    stopEditing: () => dispatch(stopPageEditing()),
    updateEditedText: text => dispatch(updateEditedText(text)),
    updatePage: (id, diffId, text) => dispatch(updatePage(id, diffId, text)),
  };
}

const TextBlockEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextBlockEditorView);

export default TextBlockEditor;
