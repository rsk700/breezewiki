import React from 'react';
import { Field, reduxForm } from 'redux-form'

const lower = v => v && v.toLowerCase()

let LoginForm = props => {
  return (
    <div className="fullscreen-login-container">
      <div className="login-container">
        <div className="text-center">
        Breeze Wiki
        </div>
        <form onSubmit={ props.handleSubmit }>
          <div className="form-group">
            <Field name="email" component="input" type="text" className="form-control" placeholder="email" normalize={ lower }/>
          </div>
          <div className="form-group">
            <Field name="password" component="input" type="password" className="form-control" placeholder="password" />
          </div>
          <div className="form-group text-center">
            <button type="submit" className="btn btn-default" disabled={ props.submitting || props.invalid }>login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const validate = values => {
  const errors = {};
  const noEmail = (
    !values.email ||
    !/[^@]+@[^@]+/.test(values.email)
  )
  const noPassword = (
    !values.password ||
    values.password.length < 5
  )
  if (noEmail) {
    errors.email = 'Email required';
  }
  if (noPassword) {
    errors.password = 'Password required';
  }
  return errors;
}

LoginForm = reduxForm({
  form: 'login-form',
  validate
})(LoginForm)

export default LoginForm
