import { getExchangeType, setAffiliateLinks } from '../../exchanges'
import { getUrl } from '../../utils'

const api_name = 'coingecko'

const request = async (path, params) => {
  const res = await fetch(getUrl(process.env.NEXT_PUBLIC_REQUESTER_URL, path, { ...params, api_name }))
  return await res.json()
}

export const allCrypto = async params => {
  const path = '/search'

  let response = await request(path, params)

  if (response && response.exchanges) {
    response.exchanges = response.exchanges.map(exchange => { return { ...exchange, exchange_type: getExchangeType(exchange.id) } })
  }

  return response
}

export const allCategories = async params => {
  const path = '/coins/categories/list'
  return await request(path, params)
}

export const exchangeRates = async params => {
  const path = '/exchange_rates'
  return await request(path, params)
}

export const cryptoGlobal = async params => {
  const path = '/global'
  return await request(path, params)
}

export const defiGlobal = async params => {
  const path = '/global/decentralized_finance_defi'
  return await request(path, params)
}

export const trendingSearch = async params => {
  const path = '/search/trending'
  return await request(path, params)
}

export const simplePrice = async params => {
  const path = '/simple/price'
  return await request(path, params)
}

export const coinsMarkets = async params => {
  const path = '/coins/markets'
  return await request(path, params)
}

export const categoriesMarkets = async params => {
  const path = '/coins/categories'
  return await request(path, params)
}

export const derivatives = async params => {
  const path = '/derivatives'
  return await request(path, params)
}

export const exchanges = async params => {
  const path = '/exchanges'

  let response = await request(path, params)

  if (Array.isArray(response)) {
    response = response.map(exchange => { return { ...exchange, exchange_type: getExchangeType(exchange.id), url: setAffiliateLinks(exchange.url) } })
  }

  return response
}

export const derivativesExchanges = async params => {
  const path = '/derivatives/exchanges'

  let response = await request(path, params)

  if (Array.isArray(response)) {
    response = response.map(exchange => { return { ...exchange, exchange_type: getExchangeType(exchange.id), url: setAffiliateLinks(exchange.url) } })
  }

  return response
}

export const publicCompanies = async (coin_id, params) => {
  const path = `/companies/public_treasury/${coin_id}`
  return await request(path, params)
}