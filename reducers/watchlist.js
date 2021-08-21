import { WATCHLISTS_DATA } from './types'

export default function watchlist(
  state = {
    [`${WATCHLISTS_DATA}`]: null,
  },
  action
) {
  switch (action.type) {
    case WATCHLISTS_DATA:
      return {
        ...state,
        [`${WATCHLISTS_DATA}`]: action.value
      }
    default:
      return state
  }
}