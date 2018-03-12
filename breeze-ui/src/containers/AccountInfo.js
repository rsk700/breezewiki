import { connect } from 'react-redux'
import AccountInfoView from '../components/AccountInfoView'

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
  };
}

const AccountInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountInfoView);

export default AccountInfo;
