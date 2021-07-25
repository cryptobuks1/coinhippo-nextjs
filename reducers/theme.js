import { THEME, RESET_THEME } from './types'

export default function palettes(
  state = {
    background: 'light',
    navbar: 'light',
    leftSidebar: 'light',
  },
  action
) {
  switch (action.type) {
    case THEME:
      return {
        ...state,
        background: action.value,
        navbar: action.value,
        leftSidebar: action.value,
      }
    case RESET_THEME:
      return {
        background: 'light',
        navbar: 'light',
        leftSidebar: 'light',
      }
    default:
      return state
  }
}