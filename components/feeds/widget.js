import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Widget from '../widget'
import FearAndGreed from '../feeds/fear-and-greed'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaBitcoin, FaGasPump, FaYoutube, FaPodcast, FaRegNewspaper, FaBookDead, FaCoins, FaSearch, FaRegGrinStars, FaUserNinja } from 'react-icons/fa'
import { AiFillAlert, AiOutlinePrinter } from 'react-icons/ai'
import { IoIosRocket } from 'react-icons/io'
import { RiEmotionSadLine } from 'react-icons/ri'
import { GiWatch, GiUnicorn, GiWalk, GiRun, GiSprint, GiBurningEmbers, GiDolphin, GiSharkFin, GiWhaleTail, GiSpermWhale } from 'react-icons/gi'
import { BiTime, BiGhost, BiDonateHeart } from 'react-icons/bi'
import { BsPencilSquare, BsBoxArrowInRight, BsQuestionSquare } from 'react-icons/bs'
import { HiOutlineRefresh } from 'react-icons/hi'
import { FcLock, FcUnlock } from 'react-icons/fc'
import Linkify from 'react-linkify'
import moment from 'moment'
import { getName, numberFormat } from '../../lib/utils'

const repeatIcon = (data, iconSize = 24) => {
  const min_amount = 10000000

  const amount = data.amount_usd

  const icon = data.transaction_type === 'mint' ? <AiOutlinePrinter size={iconSize} /> :
    data.transaction_type === 'burn' ? <GiBurningEmbers size={iconSize} /> :
    data.transaction_type === 'lock' ? <FcLock size={iconSize} /> :
    data.transaction_type === 'unlock' ? <FcUnlock size={iconSize} /> :
    data.is_donation ? <BiDonateHeart size={iconSize} /> :
    data.is_hacked ? <FaUserNinja size={iconSize} /> :
    amount <= 5 * min_amount ? <GiDolphin size={iconSize} /> :
    amount <= 10 * min_amount ? <GiSharkFin size={iconSize} /> :
    amount <= 50 * min_amount ? <GiWhaleTail size={iconSize} /> :
    <GiSpermWhale size={iconSize} />

  return [...Array(
    amount <= (data.transaction_type !== 'transfer' ? 1.5 : data.is_donation || data.is_hacked ? 1 : 5) * min_amount ? 1 :
    amount <= (data.transaction_type !== 'transfer' ? 3 : data.is_donation || data.is_hacked ? 2 : 10) * min_amount ? 2 :
    amount <= (data.transaction_type !== 'transfer' ? 10 : data.is_donation || data.is_hacked ? 5 : 50) * min_amount ? 3 : 4
  ).keys()]
  .map(i => (<span key={i}>{icon}</span>))
}

const FeedWidget = ({ feedType = null, data = null }) => {
  const { _data, theme } = useSelector(state => ({ _data: state.data, theme: state.theme }), shallowEqual)
  const { all_crypto_data } = { ..._data }
  const { background } = { ...theme }

  let json = data && data.Json && JSON.parse(data.Json)
  if (feedType === 'whales' && json && !Array.isArray(json)) {
    json = [json]
  }

  const isSkeleton = data && data.ID === 'skeleton'

  const isInterested = data && json ?
    data.FeedType === 'fear_and_greed' ?
      Number(json.value) <= json.low_threshold * 3 / 2 || Number(json.value) >= json.high_threshold * 2 / 3 :
    data.FeedType === 'gas' ?
      json.avgGas <= json.gas_gwei_threshold * 2 / 3 :
    data.FeedType === 'news' ?
      json.title && ['breaking'].findIndex(keyword => json.title.toLowerCase().includes(keyword)) > -1 :
    data.FeedType === 'whales' ?
      json[0].is_donation || json[0].is_hacked || repeatIcon(json[0]).length > (json[0].transaction_type === 'transfer' ? 3 : 2) :
    data.FeedType === 'markets' ?
      ['_ath', '_atl', '_fomo', '_panic', '_bitcoin'].findIndex(market_type => data.SortKey.endsWith(market_type)) > -1 : false
    : false

  return (
    <Widget className={`${isInterested ? 'shadow border-yellow-400 dark:border-yellow-600' : ''}`}>
      <div className="flex items-start justify-start space-x-4 p-2">
        <div className="w-8 flex-shrink-0">
          {isSkeleton ?
            <div className="skeleton w-full h-8 shadow-lg rounded-full" />
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
              className="w-full h-8 shadow-lg rounded-full ring"
            />
          }
        </div>
        <div className="w-full flex flex-col">
          <div className="flex items-center text-base font-medium">
            {isSkeleton ?
              <div className="skeleton w-3/4 h-4 rounded my-1.5" />
              :
              feedType === 'fear_and_greed' ?
                <><FaBitcoin size={24} className="text-yellow-500 mb-0.5 mr-2" /><span className="h-6">{getName(feedType)} Index</span></> :
              feedType === 'gas' ?
                <><FaGasPump size={18} className="text-gray-500 mr-3" /><span className="h-6">ETH Gas is {json.avgGas <= json.gas_gwei_threshold * 2 / 3 ? 'very low' : 'not high'}</span></> :
              feedType === 'news' ?
                json.kind === 'media' ? json.domain && json.domain.includes('youtube') ? <><FaYoutube size={24} className="text-red-500 mr-2" /><span className="h-6">YouTube</span></> : <><FaPodcast size={24} className="text-blue-400 mr-2" /><span className="h-6">Podcast</span></> : <><FaRegNewspaper size={24} className="text-gray-500 mr-2" /><span className="h-6">News</span></> :
              feedType === 'whales' ?
                <div className="w-full flex items-center">
                  <AiFillAlert size={20} className="text-red-500 mb-1 mr-2.5" /><span className="h-6 mr-1">Whale activity</span>
                  <div className="flex items-center text-indigo-800 ml-auto">
                    {repeatIcon(json[0], 18)}
                  </div>
                </div> :
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
                  <><GiUnicorn size={24} className="text-indigo-400 mb-1 mr-1.5" /><span className="h-6">Top {getName('defi')}</span></> :
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
          <div className="flex flex-row items-center text-gray-500 text-xs font-normal mt-0.5">
            {isSkeleton ?
              <div className="skeleton w-2/3 h-3 rounded mb-3" />
              :
              feedType === 'fear_and_greed' ?
                <><HiOutlineRefresh size={14} className="mb-1 mr-1" /><span className="h-5">{moment(data.CreatedAt * 1000).fromNow()} ({moment(data.CreatedAt * 1000).format('h:[00] A')})</span></> :
              feedType === 'news' ?
                <><BsPencilSquare size={14} className="mb-1 mr-1" /><span className="h-5">{moment(json.published_at).fromNow()}{moment().diff(moment(json.published_at), 'hours') >= 1 && (<> ({moment(json.published_at).format('LT')})</>)}</span></> :
                <>{feedType === 'gas' ? <GiWatch size={18} className="mb-1 mr-1" /> : <BiTime size={14} className="mb-1 mr-1" />}<span className="h-5">{moment(data.CreatedAt * 1000).fromNow()}{moment().diff(moment(data.CreatedAt * 1000), 'hours') >= 1 && (<> ({moment(data.CreatedAt * 1000).format('LT')})</>)}</span></>
            }
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            {isSkeleton ?
              <div className="space-y-2">
                {feedType === 'fear_and_greed' ?
                  <>
                    <div className="flex items-center">
                      <div className="skeleton w-3/5 h-4 rounded" />
                      <span className="ml-auto">
                        <div className="skeleton w-6 h-6 rounded-full" />
                      </span>
                    </div>
                    <div className="skeleton w-5/6 h-3.5 rounded" />
                  </> :
                feedType === 'gas' ?
                  <>
                    <div className="skeleton w-5/6 h-3 rounded" />
                    <div className="flex items-center py-2">
                      {[...Array(3).keys()].map(i => (
                        <div key={i} className="w-1/3 flex flex-col items-center justify-center">
                          <div className="h-6 mb-2">
                            <div className="skeleton w-6 h-6 rounded-full" />
                          </div>
                          <div className="skeleton w-3/4 h-3 rounded" />
                        </div>
                      ))}
                    </div>
                  </> :
                feedType === 'whales' ?
                  <div>
                    <div className="w-full flex items-center mt-1">
                      <div className="w-full flex items-center font-semibold">
                        <div className="w-1/2 flex items-center mr-2">
                          <div className="skeleton w-8 h-8 rounded mr-2" />
                          <div className="skeleton w-1/3 h-3.5 rounded" />
                        </div>
                        <div className="w-1/2 flex items-center ml-auto">
                          <div className="skeleton w-1/2 h-4 rounded ml-auto" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      {[...Array(3).keys()].map(i => (
                        <div key={i} className="w-1/3 flex flex-col items-center justify-center">
                          <div className="h-6 mb-2">
                            <div className="skeleton w-6 h-6 rounded" />
                          </div>
                          <div className="skeleton w-3/4 h-3 rounded" />
                        </div>
                      ))}
                    </div>
                  </div> :
                feedType.startsWith('markets') ?
                  ['_ath', '_atl', '_marketcap', '_trending', '_defi', '_nfts', '_fomo', '_panic'].findIndex(market_type => feedType.endsWith(market_type)) > -1 ?
                    [...Array(3).keys()].map(i => (
                      <div key={i} className={`mt-${i > 0 ? 3 : 0} mb-2 ${i < 3 - 1 ? 'border-b border-gray-100 pb-3' : ''}`}>
                        <div className="flex items-center font-semibold">
                          <div className="w-1/2 flex items-center mr-2">
                            <div className="skeleton w-8 h-8 rounded mr-2" />
                            <div className="skeleton w-1/3 h-3.5 rounded" />
                          </div>
                          <div className="w-1/2 flex items-center ml-auto">
                            <div className="skeleton w-1/2 h-4 rounded ml-auto" />
                          </div>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="w-1/2 skeleton w-2/5 h-3 rounded mr-2" />
                          <div className="w-1/2 flex items-center ml-auto">
                            <div className="skeleton w-2/5 h-3 rounded ml-auto" />
                          </div>
                        </div>
                      </div>
                    )) :
                  ['_bitcoin'].findIndex(market_type => feedType.endsWith(market_type)) > -1 ?
                    <>
                      <div className="flex items-start mb-4">
                        <div className="skeleton w-1/2 h-6 rounded" />
                        <span className="w-1/2 flex items-start">
                          <div className="skeleton w-1/3 h-4 rounded ml-auto" />
                        </span>
                      </div>
                      <div className="w-full flex flex-col">
                        <div className="skeleton w-2/5 h-3 rounded" />
                        <div className="skeleton w-1/2 h-3 rounded mt-2" />
                      </div>
                    </>
                    : null
                  :
                  <>
                    <div className="skeleton w-full h-3.5 rounded" />
                    <div className="skeleton w-full h-3.5 rounded" />
                    <div className="skeleton w-3/4 h-3.5 rounded" />
                  </>
                }
              </div>
              :
              feedType === 'fear_and_greed' ?
                <FearAndGreed data={json} /> :
              feedType === 'gas' ?
                <>
                  Maybe it's time to <Link href="/decentralized-finance-defi"><a className="font-semibold">{getName('defi')}</a></Link> or <Link href="/non-fungible-tokens-nft"><a className="font-semibold">{getName('nfts')}</a></Link>.
                  <div className="flex items-center mt-4 mb-2">
                    {['SafeGasPrice', 'ProposeGasPrice', 'FastGasPrice'].map((speed, i) => (
                      <div key={i} className="w-1/3 flex flex-col items-center justify-center">
                        <div className="h-6 mb-2">
                          {i === 0 ?
                            <GiWalk size={24} className="text-red-300" /> :
                          i === 2 ?
                            <GiSprint size={24} className="text-red-500 mt-0.5" /> :
                            <GiRun size={22} className="text-red-400 mt-0.5" />
                          }
                        </div>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{json[speed]} Gwei</span>
                      </div>
                    ))}
                  </div>
                </> :
              feedType === 'news' ?
                <Linkify>{json.title}</Linkify> :
              feedType === 'whales' ?
                json.map((txData, i) => {
                  const coinData = txData && txData.symbol && all_crypto_data && all_crypto_data.coins && _.head(all_crypto_data.coins.filter(coinData => coinData.symbol && coinData.symbol.toLowerCase() === txData.symbol))
                  const fromExchangeData = txData && txData.from_address_type === 'exchange' && txData.from_address_name && all_crypto_data && all_crypto_data.exchanges && _.head(all_crypto_data.exchanges.filter(exchangeData => (exchangeData.name && exchangeData.name.toLowerCase().split(' ').includes(txData.from_address_name.toLowerCase())) || (exchangeData.id && exchangeData.id.toLowerCase().split(' ').includes(txData.from_address_name.toLowerCase()))))
                  const toExchangeData = txData && txData.to_address_type === 'exchange' && txData.to_address_name && all_crypto_data && all_crypto_data.exchanges && _.head(all_crypto_data.exchanges.filter(exchangeData => (exchangeData.name && exchangeData.name.toLowerCase().split(' ').includes(txData.to_address_name.toLowerCase())) || (exchangeData.id && exchangeData.id.toLowerCase().split(' ').includes(txData.to_address_name.toLowerCase()))))

                  const fromComponent = (
                    <>
                      <div className="h-6 mt-2 mb-1">
                        {fromExchangeData && fromExchangeData.large ?
                          <img
                            src={fromExchangeData.large}
                            alt=""
                            className="w-6 h-6 rounded"
                          />
                          :
                          <BsQuestionSquare size={20} className={`${txData.from_url ? '' : 'text-gray-300 dark:text-gray-500'}`} />
                        }
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 text-xs font-medium">{txData.from_address_name}</span>
                    </>
                  )

                  const toComponent = (
                    <>
                      <div className="h-6 flex justify-end mt-2 mb-1">
                        {toExchangeData && toExchangeData.large ?
                          <img
                            src={toExchangeData.large}
                            alt=""
                            className="w-6 h-6 rounded"
                          />
                          :
                          <BsQuestionSquare size={20} className={`${txData.to_url ? '' : 'text-gray-300 dark:text-gray-500'}`} />
                        }
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 text-xs font-medium text-right">{txData.to_address_name}</span>
                    </>
                  )

                  return (
                    <div key={txData.key} className={`mt-${i > 0 ? 3 : 0} mb-2 ${i < json.length - 1 ? 'border-b border-gray-100 pb-2' : ''}`}>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center mr-2">
                          {coinData && (
                            <img
                              src={coinData.image || coinData.large || coinData.thumb}
                              alt=""
                              className="w-8 h-8 rounded mr-2"
                            />
                          )}
                          <span className="text-sm font-semibold">{txData.symbol && txData.symbol.toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col items-end ml-auto">
                          <div className="text-sm font-semibold">{numberFormat(txData.amount, '0,0')} {txData.symbol && txData.symbol.toUpperCase()}</div>
                          <div className="text-xs font-normal">${numberFormat(txData.amount_usd, '0,0')}</div>
                        </div>
                      </div>
                      <div className="flex items-start mt-3 mb-2">
                        {['burn', 'transfer'].includes(txData.transaction_type) && (
                          <div className="w-2/5 flex flex-col items-start">
                            <span className="text-gray-400 dark:text-gray-300 text-xs font-normal">From</span>
                            {txData.from_url ?
                              <a href={txData.from_url} target="_blank" rel="noopener noreferrer">
                                {fromComponent}
                              </a>
                              :
                              fromComponent
                            }
                          </div>
                        )}
                        <div className="w-1/5 my-auto">
                          <a href={txData.tx_url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                            <div className="h-6 mt-2 mb-1">
                              {txData.transaction_type === 'mint' ?
                                <AiOutlinePrinter size={24} /> :
                              txData.transaction_type === 'burn' ?
                                <GiBurningEmbers size={24} /> :
                              txData.transaction_type === 'lock' ?
                                <FcLock size={24} /> :
                              txData.transaction_type === 'unlock' ?
                                <FcUnlock size={24} /> :
                              txData.is_donation ?
                                <BiDonateHeart size={24} /> :
                              txData.is_hacked ?
                                <FaUserNinja size={24} /> :
                                <BsBoxArrowInRight size={24} />
                              }
                            </div>
                            <span className="text-xs font-medium">
                              {txData.transaction_type ? getName(txData.is_donation ? 'donation' : txData.is_hacked ? 'stolen funds' : txData.transaction_type) : null}
                            </span>
                          </a>
                        </div>
                        {txData.transaction_type !== 'burn' && (
                          <div className="w-2/5 flex flex-col items-end">
                            <span className="text-gray-400 dark:text-gray-300 text-xs font-nomal">To</span>
                            {txData.to_url ?
                              <a href={txData.to_url} target="_blank" rel="noopener noreferrer" className="text-right">
                                {toComponent}
                              </a>
                              :
                              toComponent
                            }
                          </div>
                         )}
                      </div>
                    </div>
                  )
                }) :
              feedType === 'markets' && data.SortKey ?
                ['_ath', '_atl', '_marketcap', '_trending', '_defi', '_nfts', '_fomo', '_panic'].findIndex(market_type => data.SortKey.endsWith(market_type)) > -1 ?
                  json.length === 1 ?
                    json.map(coinData => (
                      <div key={coinData.id}>
                        <div className="flex items-center mr-2">
                          <img
                            src={coinData.image || coinData.large || coinData.thumb}
                            alt=""
                            className="w-8 h-8 rounded mr-2"
                          />
                          <span className="text-base font-semibold">{coinData.name}</span>
                        </div>
                        <div className={`flex items-start text-${coinData.price_change_percentage_24h < 0 ? 'red' : coinData.price_change_percentage_24h > 0 ? 'green' : 'gray'}-500 text-3xl font-semibold my-2`}>
                          <span className="mr-2">${numberFormat(data.SortKey.endsWith('_ath') ? coinData.high_price : data.SortKey.endsWith('_atl') ? coinData.low_price : coinData.current_price, '0,0.00000000')}</span>
                          <span className="flex items-start text-sm font-normal mt-0.5 ml-auto">
                            {numberFormat(coinData.price_change_percentage_24h / 100, '+0,0.00%')}
                            {coinData.price_change_percentage_24h < 0 ? <FiArrowDown size={18} className="ml-0.5" /> : coinData.price_change_percentage_24h > 0 ? <FiArrowUp size={18} className="ml-0.5" /> : null}
                          </span>
                        </div>
                        <div className="w-full flex flex-col mt-3 mb-2">
                          <div className="uppercase text-gray-400"><span className="text-xs mr-1">Market Cap</span><span className="font-semibold">#{numberFormat(coinData.market_cap_rank, '0,0')}</span></div>
                          <div className="text-xs font-semibold">{numberFormat(coinData.market_cap, '0,0')}</div>
                        </div>
                      </div>
                    )) :
                    json.map((coinData, i) => (
                      <div key={coinData.id} className={`mt-${i > 0 ? 3 : 0} mb-2 ${i < json.length - 1 ? 'border-b border-gray-100 pb-3' : ''}`}>
                        <div className="flex items-center text-sm font-semibold">
                          <div className="flex items-center mr-2">
                            <img
                              src={coinData.image || coinData.large || coinData.thumb}
                              alt=""
                              className="w-6 h-6 rounded mr-2"
                            />
                            <span className={`${data.SortKey.endsWith('_trending') ? 'font-extrabold' : ''}`}>{coinData.symbol && coinData.symbol.toUpperCase()}</span>
                          </div>
                          <div className={`flex items-center text-${coinData.price_change_percentage_24h < 0 ? 'red' : coinData.price_change_percentage_24h > 0 ? 'green' : 'gray'}-500 ${['_ath', '_atl'].findIndex(market_type => data.SortKey.endsWith(market_type)) > -1 ? 'font-extrabold' : 'font-medium'} ml-auto`}>
                            ${numberFormat(data.SortKey.endsWith('_ath') ? coinData.high_price : data.SortKey.endsWith('_atl') ? coinData.low_price : coinData.current_price, '0,0.00000000')}
                            {coinData.price_change_percentage_24h < 0 ? <FiArrowDown size={16} className="mb-0.5 ml-0.5" /> : coinData.price_change_percentage_24h > 0 ? <FiArrowUp size={16} className="mb-0.5 ml-0.5" /> : null}
                          </div>
                        </div>
                        <div className="flex items-center text-xs font-normal mt-1">
                          <div className="text-gray-400 dark:text-gray-500 mr-2"><span className="text-gray-600 dark:text-gray-400 font-semibold mr-1.5">#{numberFormat(coinData.market_cap_rank, '0,0')}</span>{coinData.name}</div>
                          <div className={`text-${coinData.price_change_percentage_24h < 0 ? 'red' : coinData.price_change_percentage_24h > 0 ? 'green' : 'gray'}-500 ${data.SortKey.endsWith('_marketcap') ? 'font-extrabold' : ''} ml-auto`}>
                            {numberFormat(coinData.price_change_percentage_24h / 100, '+0,0.00%')}
                          </div>
                        </div>
                      </div>
                    )) :
                ['_bitcoin'].findIndex(market_type => data.SortKey.endsWith(market_type)) > -1 ?
                  json.map(coinData => (
                    <div key={coinData.id}>
                      <div className={`flex items-start text-${coinData.price_change_percentage_24h < 0 ? 'red' : coinData.price_change_percentage_24h > 0 ? 'green' : 'gray'}-500 text-3xl font-semibold my-2`}>
                        <span className="mr-2">${numberFormat(coinData.current_price, '0,0')}</span>
                        <span className="flex items-start text-sm font-normal mt-0.5 ml-auto">
                          {numberFormat(coinData.price_change_percentage_24h / 100, '+0,0.00%')}
                          {coinData.price_change_percentage_24h < 0 ? <FiArrowDown size={18} className="ml-0.5" /> : coinData.price_change_percentage_24h > 0 ? <FiArrowUp size={18} className="ml-0.5" /> : null}
                        </span>
                      </div>
                      <div className="w-full flex flex-col mt-3 mb-2">
                        <div className="uppercase text-gray-400"><span className="text-xs mr-1">Market Cap</span><span className="font-semibold">#{numberFormat(coinData.market_cap_rank, '0,0')}</span></div>
                        <div className="text-xs font-semibold">{numberFormat(coinData.market_cap, '0,0')}</div>
                      </div>
                    </div>
                  ))
                  : null
                : null
            }
          </div>
          <div className="flex flex-wrap text-gray-400 text-sm font-normal mt-2">
            {isSkeleton ?
              <div className="skeleton w-2/3 h-3 rounded mt-3 mb-1.5" />
              :
              ['fear_and_greed', 'gas'].includes(feedType) ?
                <><span className="h-6 mr-1">via</span><a href={json.url} target="_blank" rel="noopener noreferrer" className="font-semibold">{json.source_name}</a></> :
              feedType === 'news' ?
                <><span className="h-6 mr-1">via</span><a href={json.url} target="_blank" rel="noopener noreferrer" className="font-semibold">{json.source.title}</a></> :
              feedType === 'whales' ?
                <><span className="h-6 mr-1">via</span><a href="https://twitter.com/whale_alert" target="_blank" rel="noopener noreferrer" className="font-semibold">Whale Alert</a></> :
              feedType === 'markets' && data.SortKey ?
                ['_ath', '_atl', '_marketcap', '_trending', '_defi', '_nfts', '_fomo', '_panic', '_bitcoin'].findIndex(market_type => data.SortKey.endsWith(market_type)) > -1 ?
                  <>
                    {json.map((coinData, i) => <Link key={i} href={`/coin${coinData ? `/${coinData.id}` : 's'}`}><a className="font-semibold mr-1">#{coinData && coinData.name}</a></Link>)}
                    {json.length < 2 && json.map((coinData, i) => <Link key={i} href={`/coin${coinData ? `/${coinData.id}` : 's'}`}><a className="font-semibold mr-1">${coinData && coinData.symbol && coinData.symbol.toUpperCase()}</a></Link>)}
                    {json.length > 1 && ['_ath', '_atl', '_trending', '_bitcoin'].findIndex(market_type => data.SortKey.endsWith(market_type)) < 0 && (
                      <Link href={`/coins${data.SortKey.endsWith('_defi') ? '/decentralized-finance-defi' : data.SortKey.endsWith('_nfts') ? '/non-fungible-tokens-nft' : ''}`}><a className="font-semibold">#{data.SortKey.endsWith('_defi') ? getName('defi') : data.SortKey.endsWith('_nfts') ? 'NFTs' : 'Market'}</a></Link>
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