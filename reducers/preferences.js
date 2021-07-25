import { VS_CURRENCY } from './types'

export default function preferences(
  state = {
    [`${VS_CURRENCY}`]: 'usd',
  },
  action
) {
  switch (action.type) {
    case VS_CURRENCY:
      return {
        ...state,
        [`${VS_CURRENCY}`]: action.value
      }
    default:
      return state
  }
}