import { combineReducers } from 'redux'

import appReducer from './appReducer'
import postReducer from './postReducer'
import settingReducer from './settingReducer'

const combinedReducers = combineReducers({
  app: appReducer,
  post: postReducer,
  setting: settingReducer
})

export default combinedReducers
