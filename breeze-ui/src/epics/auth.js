import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { combineEpics } from 'redux-observable'
import * as types from '../actions/types';
import { navigate } from '../actions/route';

const loginEpic = action$ =>
  action$.ofType(types.REQUEST_LOGIN)
    .filter(action => action.state === types.requestStates.SUCCESS)
    .map(action => navigate('/', {}))
    ;

const logoutEpic = action$ =>
  action$.ofType(types.LOGOUT)
    .filter(action => action.state === types.requestStates.START)
    .map(action => navigate('/login', {}))
    ;

export default combineEpics(
  loginEpic,
  logoutEpic
);
