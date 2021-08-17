import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Widget from '../widget'
import CopyClipboard from '../copy-clipboard'
import Image from '../image'
import Linkify from 'react-linkify'
import { generateUrl, numberFormat, ellipseAddress } from '../../lib/utils'

const NFTWidget = ({ data = null, i }) => {
  const router = useRouter()
  const { query } = { ...router }
  const { chain_name, asset } = { ...query }

  const isSkeleton = data && data.skeleton

  return (
    <Widget className="p-0">
      {isSkeleton ?
        <div className="flex flex-col m-3">
          <div className="flex items-center">
            <div className="skeleton w-6 h-6 rounded-full mr-2" />
            <div className="skeleton w-24 h-4 rounded" />
            <div className="skeleton w-8 h-4 rounded ml-1.5" />
          </div>
          <div className="skeleton w-24 h-3 rounded ml-8" />
        </div>
        :
        <div className="m-3">
          <Link href={generateUrl(`/wallet/${chain_name}/${data.contract_address}`, asset ? { asset } : null)}>
            <a className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold">
              <div className="coin-column flex items-center space-x-2">
                <Image
                  src={data.logo_url}
                  useMocked={i}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="space-x-1">
                  <span>{data.contract_name}</span>
                  {data.contract_ticker_symbol && (<span className={`uppercase text-gray-400 font-normal ${data.contract_ticker_symbol.length > 5 ? 'break-all' : ''}`}>{data.contract_ticker_symbol}</span>)}
                </span>
              </div>
            </a>
          </Link>
          <div className="flex items-center text-gray-400 text-xs font-normal space-x-1 ml-8">
            <span>{ellipseAddress(data.contract_address, 6)}</span>
            <CopyClipboard text={data.contract_address} size={14} />
          </div>
        </div>
      }
      {/*<div className="text-gray-600 dark:text-gray-400 text-sm mt-2">
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
                      <Image
                        src={fromExchangeData.large}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded"
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
                      <Image
                        src={toExchangeData.large}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded"
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
                    <div className="flex items-center space-x-2 mr-2">
                      {coinData && (
                        <Image
                          src={coinData.image || coinData.large || coinData.thumb}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded"
                        />
                      )}
                      <span className="uppercase text-sm font-semibold">{txData.symbol}</span>
                    </div>
                    <div className="flex flex-col items-end ml-auto">
                      <div className="uppercase text-sm font-semibold">{numberFormat(txData.amount, '0,0')} {txData.symbol}</div>
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
                        <span className="text-gray-400 dark:text-gray-300 text-xs font-normal">To</span>
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
                    <div className="flex items-center space-x-2 mr-2">
                      <Image
                        src={coinData.image || coinData.large || coinData.thumb}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded"
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
                      <div className="flex items-center space-x-2 mr-2">
                        <Image
                          src={coinData.image || coinData.large || coinData.thumb}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className={`uppercase ${data.SortKey.endsWith('_trending') ? 'font-extrabold' : ''}`}>{coinData.symbol}</span>
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
                {json.length < 2 && json.map((coinData, i) => <Link key={i} href={`/coin${coinData ? `/${coinData.id}` : 's'}`}><a className="uppercase font-semibold mr-1">${coinData && coinData.symbol}</a></Link>)}
                {json.length > 1 && ['_ath', '_atl', '_trending', '_bitcoin'].findIndex(market_type => data.SortKey.endsWith(market_type)) < 0 && (
                  <Link href={`/coins${data.SortKey.endsWith('_defi') ? '/decentralized-finance-defi' : data.SortKey.endsWith('_nfts') ? '/non-fungible-tokens-nft' : ''}`}><a className="font-semibold">#{data.SortKey.endsWith('_defi') ? getName('defi') : data.SortKey.endsWith('_nfts') ? 'NFTs' : 'Market'}</a></Link>
                )}
              </> : null
            : null
        }
      </div>*/}
      {isSkeleton ?
        <>
          <div className="skeleton w-full h-60" />
          <div className="mx-3">
            <div className="skeleton w-40 h-4 rounded my-4" />
            <div className="skeleton w-full h-3 rounded my-3" />
            <div className="skeleton w-full h-3 rounded my-3" />
            <div className="skeleton w-full h-3 rounded my-3" />
            <div className="skeleton w-full h-3 rounded my-3" />
            <div className="skeleton w-5/6 h-3 rounded my-3" />
            <div className="skeleton w-28 h-4 rounded my-4" />
          </div>
        </>
        :
        data.nft_data && data.nft_data.length > 0 ?
          <></>
          :
          <span className="text-gray-400 dark:text-gray-600 my-8 mx-3">
            No data available
          </span>
      }
    </Widget>
  )
}

NFTWidget.propTypes = {
  data: PropTypes.any,
}

export default NFTWidget