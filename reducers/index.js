import { combineReducers } from 'redux'
import preferences from './preferences'
import data from './data'
import externalData from './externalData'
import watchlist from './watchlist'
import config from './config'
import theme from './theme'
import leftSidebar from './leftSidebar'

export default combineReducers({
  preferences,
  data,
  externalData,
  watchlist,
  config,
  theme,
  leftSidebar,
})