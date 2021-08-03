import { GAS_DATA } from './types'

export default function preferences(
  state = {
    [`${GAS_DATA}`]: null,
  },
  action
) {
  switch (action.type) {
    case GAS_DATA:
      return {
        ...state,
        [`${GAS_DATA}`]: action.value
      }
    default:
      return state
  }
}