import { getUrl } from '../../utils'

const api_name = 'coingecko'

const request = async (path, params) => {
  const res = await fetch(getUrl(process.env.NEXT_PUBLIC_REQUESTER_URL, path, { ...params, api_name }))
  return await res.json()
}

export const allCrypto = async params => {
  const path = '/search'
  return await request(path, params)
}

export const allCategories = async params => {
  const path = '/coins/categories/list'
  return await request(path, params)
}

export const trendingSearch = async params => {
  const path = '/search/trending'
  return await request(path, params)
}

export const coinsMarkets = async params => {
  const path = '/coins/markets'
  return await request(path, params)
}