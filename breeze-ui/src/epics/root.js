import { combineEpics } from 'redux-observable'
import routingEpic from './routing'
import authEpic from './auth'
import pagesEpic from './pages'

const rootEpic = combineEpics(
  routingEpic,
  authEpic,
  pagesEpic
);

export default rootEpic;
