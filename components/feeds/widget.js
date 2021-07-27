import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Widget from '../widget'
import { FaBitcoin, FaGasPump, FaYoutube, FaPodcast, FaRegNewspaper, FaBookDead, FaCoins, FaSearch, FaRegGrinStars } from 'react-icons/fa'
import { AiFillAlert } from 'react-icons/ai'
import { IoIosRocket } from 'react-icons/io'
import { RiEmotionSadLine } from 'react-icons/ri'
import { GiUnicorn } from 'react-icons/gi'
import { BiTime, BiGhost } from 'react-icons/bi'
import { BsPencilSquare } from 'react-icons/bs'
import { HiOutlineRefresh } from 'react-icons/hi'
import parse from 'html-react-parser'
import Linkify from 'react-linkify'
import moment from 'moment'

const FeedWidget = ({ feedType = null, data = null }) => {
  const { theme } = useSelector(state => ({ theme: state.theme }), shallowEqual)
  const { background } = { ...theme }

  const json = data && data.Json && JSON.parse(data.Json)

  const isSkeleton = data && data.ID === 'skeleton'
  const skeletonColor = background === 'dark' ? 'bg-gray-800' : 'bg-gray-100'

  return data && (
    <Widget>
      <div className="flex items-start justify-start space-x-4 p-2">
        <div className="w-8 flex-shrink-0">
          {isSkeleton ?
            <div className={`${skeletonColor} animate-pulse w-full h-8 shadow-lg rounded-full ring`} />
            :
            <img
              src={`/logos/api/${
                feedType === 'fear_and_greed' ? 'alternative' :
                feedType === 'gas' ? 'etherscan' :
                feedType === 'news' ? 'cryptopanic' :
                feedType === 'whales' ? 'whalealert' :
                feedType === 'markets' && data.SortKey && data.SortKey.endsWith('_trending') ? 'coingecko' :
                'coinhippo'}.png`}
              alt=""
              className="w-full h-8 bg-white shadow-lg rounded-full ring"
            />
          }
        </div>
        <div className="w-full flex flex-col">
          <div className="flex items-center text-base font-semibold">
            {isSkeleton ?
              <div className={`${skeletonColor} animate-pulse w-3/4 h-4 rounded my-1.5`} />
              :
              feedType === 'fear_and_greed' ?
                <><FaBitcoin size={24} className="text-yellow-500 mb-0.5 mr-2" /><span className="h-6">Fear & Greed Index</span></> :
              feedType === 'gas' ?
                <><FaGasPump size={18} className="text-gray-500 mr-3" /><span className="h-6">ETH Gas is {json.avgGas <= json.gas_gwei_threshold * 2 / 3 ? 'very low' : 'not high'}</span></> :
              feedType === 'news' ?
                json.kind === 'media' ? json.domain && json.domain.includes('youtube') ? <><FaYoutube size={24} className="text-red-500 mr-2" /><span className="h-6">YouTube</span></> : <><FaPodcast size={24} className="text-blue-400 mr-2" /><span className="h-6">Podcast</span></> : <><FaRegNewspaper size={24} className="text-gray-500 mr-2" /><span className="h-6">News</span></> :
              feedType === 'whales' ?
                <><AiFillAlert size={20} className="text-red-500 mb-1 mr-2.5" /><span className="h-6">Whale activity</span></> :
              feedType === 'markets' && data.SortKey ?
                data.SortKey.endsWith('_ath') ?
                  <><IoIosRocket size={24} className="text-green-500 mr-2" /><span className="h-6">All Time High</span></> :
                data.SortKey.endsWith('_atl') ?
                  <><FaBookDead size={20} className="text-red-500 mr-2.5" /><span className="h-6">All Time Low</span></> :
                data.SortKey.endsWith('_marketcap') ?
                  <><FaCoins size={20} className="text-yellow-400 mr-2.5" /><span className="h-6">High % Change</span></> :
                data.SortKey.endsWith('_trending') ?
                  <><FaSearch size={20} className="text-indigo-400 mr-2.5" /><span className="h-6">Trending Search</span></> :
                data.SortKey.endsWith('_defi') ?
                  <><GiUnicorn size={24} className="text-indigo-400 mb-1 mr-1.5" /><span className="h-6">Top DeFi</span></> :
                data.SortKey.endsWith('_nfts') ?
                  <><BiGhost size={24} className="text-indigo-400 mr-1.5" /><span className="h-6">Top NFTs</span></> :
                data.SortKey.endsWith('_fomo') ?
                  <><FaRegGrinStars size={24} className="text-yellow-500 mb-0.5 mr-2" /><span className="h-6">FOMO Market</span></> :
                data.SortKey.endsWith('_panic') ?
                  <><RiEmotionSadLine size={24} className="text-red-500 mb-0.5 mr-2" /><span className="h-6">Panic Market</span></> :
                data.SortKey.endsWith('_bitcoin') ?
                  <><FaBitcoin size={24} className="text-yellow-500 mb-0.5 mr-2" /><span className="h-6">Bitcoin</span>{moment().diff(moment(data.CreatedAt * 1000), 'hours') < 24 && (<span className="h-6 ml-1">Today</span>)}</> : null
                : null
            }
          </div>
          <div className={`flex flex-row items-center text-gray-400 text-xs font-light mt-0.5 ml-${isSkeleton ? 8 : `7 pl-${feedType === 'news' ? 1 : 0.5}`}`}>
            {isSkeleton ?
              <div className={`${skeletonColor} animate-pulse w-2/3 h-3 rounded my-1.5`} />
              :
              feedType === 'fear_and_greed' ?
                <><HiOutlineRefresh size={14} className="mb-1 mr-1" /><span className="h-5">{moment(data.CreatedAt * 1000).fromNow()} ({moment(data.CreatedAt * 1000).format('h:[00] A')})</span></> :
              feedType === 'news' ?
                <><BsPencilSquare size={14} className="mb-1 mr-1" /><span className="h-5">{moment(json.published_at).fromNow()}{moment().diff(moment(json.published_at), 'hours') >= 1 && (<> ({moment(json.published_at).format('LT')})</>)}</span></> :
                <><BiTime size={14} className="mb-1 mr-1" /><span className="h-5">{moment(data.CreatedAt * 1000).fromNow()}{moment().diff(moment(data.CreatedAt * 1000), 'hours') >= 1 && (<> ({moment(data.CreatedAt * 1000).format('LT')})</>)}</span></>
            }
          </div>
          <div className={`text-${background === 'dark' ? 'gray-400' : 'gray-600'} text-sm mt-2`}>
            {isSkeleton ?
              <div className="space-y-2">
                {['fear_and_greed', 'gas'].includes(feedType) ?
                  <></> :
                feedType === 'whales' ?
                  <></> :
                  <>
                    <div className={`${skeletonColor} animate-pulse w-7/8 h-3.5 rounded`} />
                    <div className={`${skeletonColor} animate-pulse w-7/8 h-3.5 rounded`} />
                    <div className={`${skeletonColor} animate-pulse w-7/8 h-3.5 rounded`} />
                    <div className={`${skeletonColor} animate-pulse w-3/4 h-3.5 rounded`} />
                  </>
                }
              </div>
              :
              feedType === 'fear_and_greed' ?
                <Linkify>{parse(data.Message.replace('\n', '<br>'))}</Linkify> :
              feedType === 'gas' ?
                <Linkify>{parse(data.Message.replace('\n', '<br>'))}</Linkify> :
              feedType === 'news' ?
                json.title :
              feedType === 'whales' ?
                <Linkify>{parse(data.Message.replace('\n', '<br>'))}</Linkify> :
              feedType === 'markets' ?
                <Linkify>{parse(data.Message.replace('\n', '<br>'))}</Linkify>:<Linkify>{parse(data.Message.replace('\n', '<br>'))}</Linkify>
            }
          </div>
          <div className="flex flex-wrap text-gray-400 text-sm font-light mt-2">
            {isSkeleton ?
              <div className={`${skeletonColor} animate-pulse w-2/3 h-3 rounded my-1.5`} />
              :
              ['fear_and_greed', 'gas'].includes(feedType) ?
                <><span className="h-6 mr-2">via</span><a href={json.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold">{json.source_name}</a></> :
              feedType === 'news' ?
                <><span className="h-6 mr-2">via</span><a href={json.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold">{json.source.title}</a></> :
              feedType === 'whales' ?
                <><span className="h-6 mr-2">via</span><a href="https://twitter.com/whale_alert" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold">Whale Alert</a></> :
              feedType === 'markets' && data.SortKey ?
                ['_ath', '_atl', '_marketcap', '_fomo', '_panic', '_trending', '_defi', '_nfts', '_bitcoin'].findIndex(market_type => data.SortKey.endsWith(market_type)) > -1 ?
                  <>
                    {json.map(coinData => <Link href={`/coin${coinData ? `/${coinData.id}` : 's'}`}><a className="text-indigo-500 font-semibold mr-2">#{coinData && coinData.name}</a></Link>)}
                    {['_ath', '_atl', '_trending', '_bitcoin'].findIndex(market_type => data.SortKey.endsWith(market_type)) < 0 && (
                    	<Link href={`/coins${data.SortKey.endsWith('_defi') ? '/defi' : data.SortKey.endsWith('_nfts') ? '/nfts' : ''}`}><a className="text-indigo-500 font-semibold">#{data.SortKey.endsWith('_defi') ? 'DeFi' : data.SortKey.endsWith('_nfts') ? 'NFTs' : 'Market'}</a></Link>
                    )}
                  </> : null
                : null
            }
          </div>
        </div>
      </div>
    </Widget>
  )
}

FeedWidget.propTypes = {
  feedType: PropTypes.string,
  data: PropTypes.any,
}

export default FeedWidget