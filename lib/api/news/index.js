import { getUrl } from '../../utils'

const api_name = 'news'

export default async function request(params) {
  const res = await fetch(getUrl(process.env.NEXT_PUBLIC_REQUESTER_URL, '', { ...params, api_name }))
  return await res.json()
}