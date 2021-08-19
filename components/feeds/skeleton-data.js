import { weightedRand } from '../../lib/utils'

const feedTypes = ['fear_and_greed', 'gas', 'news', 'whales', 'markets_marketcap', 'markets_top_gainers', 'markets_trending', 'markets_top_losers', 'markets_defi', 'markets_nfts', 'markets_fomo', 'markets_panic', 'markets_bitcoin']

export default function SkeletonData(size) {
  return [...Array(size).keys()].map(i => { return { ID: 'skeleton', SortKey: i, FeedType: weightedRand(feedTypes) } })
}