import { connect } from 'react-redux'
import { navigate } from '../actions/route'
import LinkView from '../components/LinkView'

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    navigate: (route, params) => {
      dispatch(navigate(route, params))
    }
  }
}

const Link = connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkView)

export default Link;
