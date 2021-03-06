import { CONFIG, CONFIG_KEY } from './types'

export default function config(
  state = {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    title: process.env.NEXT_PUBLIC_DEFAULT_TITLE,
    description: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    collapsed: true,
    layout: 'layout',
  },
  action
) {
  switch (action.type) {
    case CONFIG:
      return {
        ...state,
        ...action.value
      }
    case CONFIG_KEY:
      return {
        ...state,
        [`${action.key}`]: action.value
      }
    default:
      return state
  }
}