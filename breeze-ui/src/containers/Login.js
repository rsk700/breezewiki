import { connect } from 'react-redux'
import { userLogin } from '../actions/auth'
import LoginForm from '../components/LoginForm'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: values => dispatch(userLogin(values.email, values.password))
  }
}

const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)

export default Login
