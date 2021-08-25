import { getRequestUrl } from '../../utils'

const api_name = 'subscan'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_REQUESTER_URL, path, { ...params, api_name }))
  return await res.json()
}

export const token = async params => {
  const path = '/scan/token'
  return await request(path, params)
}

export const meta = async params => {
  const path = '/scan/parachain/meta'
  return await request(path, params)
}

export const auctions = async params => {
  const path = '/scan/parachain/auctions'
  return await request(path, params)
}

export const bids = async params => {
  const path = '/scan/parachain/bids'
  return await request(path, params)
}

export const funds = async params => {
  const path = '/scan/parachain/funds'
  return await request(path, params)
}

export const contributes = async params => {
  const path = '/scan/parachain/contributes'
  return await request(path, params)
}

export const info = async params => {
  const path = '/scan/parachain/info'
  return await request(path, params)
}

export const predict = async params => {
  const path = '/scan/parachain/predict'
  return await request(path, params)
}

export const list = async params => {
  const path = '/scan/parachain/list'
  return await request(path, params)
}

export const auctionCompetitors = async params => {
  const path = '/scan/parachain/auctionCompetitors'
  return await request(path, params)
}

export const fundStat = async params => {
  const path = '/scan/parachain/fundStat'
  return await request(path, params)
}

export const bestBid = async params => {
  const path = '/scan/parachain/bestBid'
  return await request(path, params)
}