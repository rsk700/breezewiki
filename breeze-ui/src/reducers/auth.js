import * as types from '../actions/types'

let initialState = {
  isAuth: false,
  busy: false,
  token: null,
  user: null
}

function login(state, action) {
  switch (action.state) {
    case 'start':
      if (state.busy) {
        return state;
      }
      else {
        return {
          isAuth: false,
          busy: true,
          token: null,
          user: null
        }
      }
    case 'success':
      return {
        isAuth: true,
        busy: false,
        token: action.token,
        user: action.user
      }
    case 'fail':
      return {
        isAuth: false,
        busy: false,
        token: null,
        user: null
      }
    default:
      return state
  }
}

function logout(state, action) {
  switch (action.state) {
    case types.requestStates.START:
      return {
        isAuth: false,
        busy: false,
        token: null,
        user: null
      }
    default:
      return state
  }
}

export default function auth(state=initialState, action) {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return login(state, action)
    case types.LOGOUT:
      return logout(state, action)
    default:
      return state
  }
}
