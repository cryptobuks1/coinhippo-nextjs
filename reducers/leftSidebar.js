import { LEFT_SIDEBAR_CONFIG } from './types'

export default function leftSidebar(
  state = {
    showLogo: true,
  },
  action
) {
  switch (action.type) {
    case LEFT_SIDEBAR_CONFIG:
      return {
        ...state,
        [`${action.key}`]: action.value
      }
    default:
      return state
  }
}