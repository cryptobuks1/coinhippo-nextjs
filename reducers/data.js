import { GLOBAL_DATA, GAS_DATA, ALL_CRYPTO_DATA, TRENDING_DATA, EXCHANGE_RATES_DATA } from './types'

export default function preferences(
  state = {
    [`${GLOBAL_DATA}`]: null,
    [`${GAS_DATA}`]: null,
    [`${ALL_CRYPTO_DATA}`]: null,
    [`${TRENDING_DATA}`]: null,
    [`${EXCHANGE_RATES_DATA}`]: null,
  },
  action
) {
  switch (action.type) {
    case GLOBAL_DATA:
      return {
        ...state,
        [`${GLOBAL_DATA}`]: action.value
      }
    case GAS_DATA:
      return {
        ...state,
        [`${GAS_DATA}`]: action.value
      }
    case ALL_CRYPTO_DATA:
      return {
        ...state,
        [`${ALL_CRYPTO_DATA}`]: action.value
      }
    case TRENDING_DATA:
      return {
        ...state,
        [`${TRENDING_DATA}`]: action.value
      }
    case EXCHANGE_RATES_DATA:
      return {
        ...state,
        [`${EXCHANGE_RATES_DATA}`]: action.value
      }
    default:
      return state
  }
}