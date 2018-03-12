import * as types from './types';

export function navigate(path, params) {
  return (dispatch, getState) => {
    if (!getState().route.busy) {
      dispatch({
        type: types.ROUTE_CHANGE,
        state: 'start',
        route: { path, params }
      });
    }
  }
}

export function navigationSuccess(route) {
  return {
    type: types.ROUTE_CHANGE,
    state: 'success',
    route
  }
}

export function navigationFail(route) {
  return {
    type: types.ROUTE_CHANGE,
    state: 'fail',
    route
  }
}

export function initNavigationHistory() {
  return (dispatch, getState) => {
    window.onpopstate = (event) => {
      dispatch(navigate(event.state.route.path, event.state.route.params));
    }
  }
}
