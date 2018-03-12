import { combineEpics } from 'redux-observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import * as types from '../actions/types'
import { setActivePage, getActivePageHistory } from '../actions/pages'
import { navigationSuccess } from '../actions/route'


const routingEpic = action$ =>
  action$.ofType(types.ROUTE_CHANGE)
    .filter(action => action.state === 'start')
    .map(action => navigationSuccess(action.route))
    ;

const activePageEpic = action$ =>
  action$.ofType(types.ROUTE_CHANGE)
    .filter(action => action.route.path === '/page/:id' && action.state === 'success')
    .map(action => setActivePage(action.route.params.id))
    ;

const activePageHistoryEpic = action$ =>
  action$.ofType(types.ROUTE_CHANGE)
    .filter(action => action.route.path === '/page/:id/history' && action.state === 'success')
    .map(() => getActivePageHistory())
    ;

const activeDefaultPageEpic = (action$, store) =>
  action$.ofType(types.ROUTE_CHANGE)
    .filter(action => action.route.path === '/' && action.state === 'success')
    .map(action => setActivePage(store.getState().auth.user.default_page_id))
    ;

export default combineEpics(
  routingEpic,
  activePageEpic,
  activePageHistoryEpic,
  activeDefaultPageEpic
);
