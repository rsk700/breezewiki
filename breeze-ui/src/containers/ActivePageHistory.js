import { connect } from 'react-redux'
import PageHistoryView from '../components/PageHistoryView'
import { getActivePage } from '../reducers/pages'
import { navigate } from '../actions/route'
import { getMoreActivePageHistory } from '../actions/pages'

const mapStateToProps = state => {
  return {
    page: getActivePage(state),
    history: state.pages.activePage.history,
    hasMoreHistory: state.pages.activePage.historyCursor !== null,
    isFetched: state.pages.activePage.firstHistoryRequest
  };
}

const mapDispatchToProps = dispatch => {
  return {
    showPage: pageId => dispatch(navigate('/page/:id', {id: pageId})),
    getMoreHistory: () => dispatch(getMoreActivePageHistory())
  };
}

const ActivePageHistory = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageHistoryView);

export default ActivePageHistory;
