import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducers/root';
import rootEpic from './epics/root';

let store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    createLogger(),
    createEpicMiddleware(rootEpic)
  )
);


export default store
