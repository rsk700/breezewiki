import { connect } from 'react-redux'
import LogoutView from '../components/LogoutView'
import { logout } from '../actions/auth'

const mapStateToProps = state => {
  return {
  };
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

const Logout = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogoutView);

export default Logout;
