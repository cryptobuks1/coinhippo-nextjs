import { getRequestUrl } from '../../utils'

const api_name = 'analytics'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_REQUESTER_URL, path, { ...params, api_name }))
  return await res.json()
}

export const marketsStatus = async params => {
  const path = '/markets/status'
  return await request(path, params)
}