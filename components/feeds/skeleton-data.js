import { weightedRand } from '../../lib/utils'

const feedTypes = ['news', 'markets_marketcap', 'whales', 'markets_fomo', 'markets_trending', 'gas', 'markets_bitcoin', 'markets_panic', 'markets_defi', 'fear_and_greed', 'markets_nfts']

export default function SkeletonData(size) {
  return [...Array(size).keys()].map(i => { return { ID: 'skeleton', SortKey: i, FeedType: weightedRand(feedTypes) } })
}