import React, { Component } from 'react'
import { connect } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'
import * as auth from './actions/auth'
import Router from './containers/Router';

class App extends Component {

  componentDidMount() {
    this.props.dispatch(auth.autoLogin());
  }

  render() {
    return (
      <Router />
    );
  }
}

App = connect()(App);

export default App;
