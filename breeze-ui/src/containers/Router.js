import { connect } from 'react-redux'
import { navigate, initNavigationHistory } from '../actions/route'
import RouterView from '../components/RouterView'

const mapStateToProps = state => {
  if (state.route.route === null) {
    return {
      path: null,
      params: null,
      isAuth: state.auth.isAuth
    }
  }
  else {
    return {
      path: state.route.route.path,
      params: state.route.route.params,
      isAuth: state.auth.isAuth
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initRoute: () => {
      dispatch(initNavigationHistory());
      dispatch(navigate('/login', {}));
    }
  }
}

const Router = connect(
  mapStateToProps,
  mapDispatchToProps
)(RouterView)

export default Router
