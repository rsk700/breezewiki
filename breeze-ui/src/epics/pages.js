import 'rxjs/add/operator/filter'
import { combineEpics } from 'redux-observable'
import * as types from '../actions/types'
import { navigate } from '../actions/route'
import { getPage } from '../actions/pages'

const pagesEpic = (action$, store) =>
  action$.ofType(types.CREATE_PAGE)
    .filter(action => action.state === 'success')
    .map(action => navigate('/page/:id', {id: action.page.normal_title}))
    ;

const activePageEpic = action$ =>
  action$.ofType(types.SET_ACTIVE_PAGE)
    .map(action => getPage(action.id))
    ;

export default combineEpics(
  pagesEpic,
  activePageEpic
)
