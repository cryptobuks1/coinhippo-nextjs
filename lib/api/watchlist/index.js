import { getRequestUrl } from '../../utils'

const api_name = 'watchlist'

export default async function request(params) {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_REQUESTER_URL, '', { ...params, api_name }))
  return await res.json()
}