import { LEFT_SIDEBAR_CONFIG } from './types'

export default function leftSidebar(
  state = {
    showButtonText: true,
    showSectionTitle: true,
    showLogo: true,
    showCard: true,
    showAccountLinks: false,
    showProjects: true,
    showTags: true,
    card: 1,
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