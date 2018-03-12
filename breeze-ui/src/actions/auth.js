import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable'
import * as types from './types';
import api from '../api';

export function autoLogin() {
  return (dispatch, getState) => {
    const token = localStorage.getItem('breeze.token')
    if (!token) {
      // no saved token, can not autologin
      return;
    }
    // have saved token need to request information about user
    dispatch({
      type: types.REQUEST_LOGIN,
      state: 'start',
    })
    api.getMe$(token)
      .catch(({error}) => { dispatch(loginFail(error)); return Observable.empty(); })
      .subscribe(user => dispatch(loginSuccess(token, user)))
      ;
  }
}

export function loginSuccess(token, user) {
  localStorage.setItem('breeze.token', token)
  return {
    type: types.REQUEST_LOGIN,
    state: 'success',
    token,
    user
  }
}

export function loginFail(error) {
  return {
    type: types.REQUEST_LOGIN,
    state: 'fail',
    error
  }
}

export function userLogin(email, password) {
  return (dispatch, getState) => {
    if (getState().auth.inProcess) {
      return Promise.resolve();
    }

    dispatch({
      type: types.REQUEST_LOGIN,
      state: 'start',
    })

    api.postAuthToken$(email, password)
      .catch(({error}) => { dispatch(loginFail(error)); return Observable.empty(); })
      .subscribe(({token, user}) => dispatch(loginSuccess(token, user)))
      ;
  }
}

function logoutSuccess() {
  return {
    type: types.LOGOUT,
    state: types.requestStates.SUCCESS
  };
}

export function logoutFail(error) {
  return {
    type: types.LOGOUT,
    state: types.requestStates.FAIL,
    error
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch({
      type: types.LOGOUT,
      state: types.requestStates.START
    });
    localStorage.removeItem('breeze.token')
    api.logout$(getState().auth.token)
      .catch(({error}) => {dispatch(logoutFail(error)); return Observable.empty(); })
      .subscribe(() => dispatch(logoutSuccess()))
      ;
  }
}
