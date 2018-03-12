import * as types from '../actions/types'
import { getUrlFromRoute } from '../routemapper';

let initialState = {
  // current route is object {path, params}, at first load route is unknown
  route: null,
  // next route for navigation
  next: null,
  // failed navigation route
  failed: null,
  // whether route changing is in progress
  busy: false
}

function changeRoute(state, action) {
  switch (action.state) {
    case 'start':
      return {...state, next: action.route, busy: true}
    case 'success': {
      let newState = {...state, route: state.next, next: null, failed: null, busy: false};
      window.history.pushState(newState, '', getUrlFromRoute(newState.route.path, newState.route.params));
      return newState;
    }
    case 'fail':
      return {...state, next: null, failed: state.next, busy: false}
    default:
      return state
  }
}

export default function route(state=initialState, action) {
  switch (action.type) {
    case types.ROUTE_CHANGE: {
      state = changeRoute(state, action);
      return state;
    }
    default:
      return state
  }
}
