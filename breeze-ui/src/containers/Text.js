import { connect } from 'react-redux'
import { editMethod } from '../reducers/pages'
import { startPageEditing } from '../actions/pages'
import TextView from '../components/TextView'
import { getActivePage } from '../reducers/pages'

const mapStateToProps = state => {
  let page = getActivePage(state);
  let text = '';
  if (page !== null) {
    text = page.text;
  }
  return {
    text,
    isEdit: (state.pages.activePage.editMethod === editMethod.BLOCK),
    editTokenType: state.pages.activePage.editedBlock.tokenType,
    editStart: state.pages.activePage.editedBlock.start
  };
}

const mapDispatchToProps = dispatch => {
  return {
    startBlockEditing: (tokenType, start, end) => dispatch(startPageEditing(editMethod.BLOCK, tokenType, start, end))
  };
}

const Text = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextView);

export default Text;
