import Watchlist from '../lib/api/watchlist'
import { WATCHLISTS_DATA } from './types'

export default function watchlist(
  state = {
    [`${WATCHLISTS_DATA}`]: null,
  },
  action
) {
  switch (action.type) {
    case WATCHLISTS_DATA:
      if (!action.noSave) {
        localStorage.setItem(WATCHLISTS_DATA, JSON.stringify(action.value))

        if (action.value && action.saveId) {
          const watchlistData = action.value[action.value.findIndex(_watchlistData => _watchlistData.id === action.saveId && _watchlistData.save)]
          if (watchlistData) {
            Watchlist({ method: 'put', ID: watchlistData.id, Json: JSON.stringify(watchlistData) })
          }
        }
      }

      return {
        ...state,
        [`${WATCHLISTS_DATA}`]: action.value
      }
    default:
      return state
  }
}