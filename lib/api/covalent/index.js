import { getUrl } from '../../utils'

const api_name = 'covalent'

const request = async (path, params) => {
  const res = await fetch(getUrl(process.env.NEXT_PUBLIC_REQUESTER_URL, path, { ...params, api_name }))
  return await res.json()
}