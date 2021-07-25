import { getUrl } from '../../utils'

export default async function request(params) {
  const res = await fetch(getUrl(process.env.NEXT_PUBLIC_API_BLOGS_URL, '', { ...params }))
  return await res.json()
}