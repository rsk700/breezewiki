import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import auth from './auth'
import route from './route'
import pages from './pages'

const rootReducer = combineReducers({
  auth,
  route,
  pages,
  form: formReducer
})
export default rootReducer
