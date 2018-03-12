import { connect } from 'react-redux'
import { navigate } from '../actions/route'
import PageView from '../components/PageView'
import {
  createPage,
  startPageEditing,
  stopPageEditing,
  updateEditedText,
  updateEditedTitle,
  updatePage,
} from '../actions/pages'
import { getActivePage } from '../reducers/pages'

const mapStateToProps = state => {
  return {
    pageId: state.pages.activePage.id,
    page: getActivePage(state),
    newTitle: state.pages.activePage.newTitle,
    newText: state.pages.activePage.newText,
    isNew: state.pages.activePage.failedById && state.pages.activePage.failedByTitle,
    editMethod: state.pages.activePage.editMethod
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startEditing: (editMethod, tokenType, start, end) => dispatch(startPageEditing(editMethod, tokenType, start, end)),
    stopEditing: () => dispatch(stopPageEditing()),
    updateEditedTitle: title => dispatch(updateEditedTitle(title)),
    updateEditedText: text => dispatch(updateEditedText(text)),
    updatePage: (id, diffId, text) => dispatch(updatePage(id, diffId, text)),
    createPage: (title, text) => dispatch(createPage(title, text)),
    showHistory: pageId => dispatch(navigate('/page/:id/history', {id: pageId})),
    showAccountInfo: () => dispatch(navigate('/account', {}))
  }
}

const Page = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageView)

export default Page;
