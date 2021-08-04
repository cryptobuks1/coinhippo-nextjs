import { getRequestUrl } from '../../utils'

export default async function request(params) {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_BLOGS_URL, '', { ...params }))
  return await res.json()
}