import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
// import Coin from '../../components/coin'
import DropdownExchange from '../../components/coin/dropdown-exchange'
import SectionTitle from '../../components/section-title'
import { Badge } from '../../components/badges'
import Image from '../../components/image'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import _ from 'lodash'
import { coin } from '../../lib/api/coingecko'
import { getTrades } from '../../lib/exchanges'
import meta from '../../lib/meta'
import { currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { getName, numberFormat } from '../../lib/utils'

export default function CoinId() {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { all_crypto_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]

  const router = useRouter()
  const { query, asPath } = { ...router }
  const { coin_id } = { ...query }

  const [coinData, setCoinData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getCoin = async () => {
      const response = await coin(coin_id, { localization: false })

      if (response && !response.error) {
        if (mountedRef.current) {
          setCoinData({
            ...response,
            market_cap_rank: typeof response.market_cap_rank === 'string' ? Number(response.market_cap_rank) : typeof response.market_cap_rank === 'number' ? response.market_cap_rank : -1,
            market_data: response.market_data && Object.fromEntries(new Map(Object.entries(response.market_data).map(([key, value]) => {
              if ([
                'current_price',
                'ath',
                'atl',
                'market_cap',
                'fully_diluted_valuation',
                'total_volume',
                'high_24h',
                'low_24h'
              ].includes(key) && value) {
                return [
                  key,
                  Object.fromEntries(new Map(Object.entries(value).map(([_key, _value]) => 
                    [_key, typeof _value === 'string' ? Number(_value) : typeof _value === 'number' ? _value : -1]
                  )))
                ]
              }
              else if ([
                'ath_change_percentage',
                'atl_change_percentage',
                'price_change_24h_in_currency',
                'price_change_percentage_1h_in_currency',
                'price_change_percentage_24h_in_currency',
                'price_change_percentage_7d_in_currency',
                'price_change_percentage_14d_in_currency',
                'price_change_percentage_30d_in_currency',
                'price_change_percentage_60d_in_currency',
                'price_change_percentage_200d_in_currency',
                'price_change_percentage_1y_in_currency',
                'market_cap_change_24h_in_currency',
                'market_cap_change_percentage_24h_in_currency'
              ].includes(key) && value) {
                return [
                  key,
                  Object.fromEntries(new Map(Object.entries(value).map(([_key, _value]) => 
                    [_key, typeof _value === 'string' ? Number(_value) : typeof _value === 'number' ? _value : Number.MIN_SAFE_INTEGER]
                  )))
                ]
              }
              else if ([
                'market_cap_rank',
                'total_value_locked',
                'mcap_to_tvl_ratio',
                'fdv_to_tvl_ratio',
                'total_supply',
                'max_supply',
                'circulating_supply'
              ].includes(key) && value) {
                return [key, typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : -1]
              }
              else if ([
                'price_change_24h',
                'price_change_percentage_24h',
                'price_change_percentage_7d',
                'price_change_percentage_14d',
                'price_change_percentage_30d',
                'price_change_percentage_60d',
                'price_change_percentage_200d',
                'price_change_percentage_1y',
                'market_cap_change_24h',
                'market_cap_change_percentage_24h'
              ].includes(key) && value) {
                return [key, typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : Number.MIN_SAFE_INTEGER]
              }
              else {
                return [key, value]
              }
            }))),
          })
        }
      }
    }

    if (coin_id) {
      getCoin()
    }

    const interval = setInterval(() => getCoin(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [coin_id])

  useEffect(() => {
    if (coinData && coinData.vs_currency !== vs_currency && coinData.market_data) {
      coinData.vs_currency = vs_currency
      coinData.roi = {
        ...coinData.market_data.roi,
        times: coinData.market_data.roi ? coinData.market_data.roi.times : coinData.market_data.atl[vs_currency] > 0 ? (coinData.market_data.current_price[vs_currency] - coinData.market_data.atl[vs_currency]) / coinData.market_data.atl[vs_currency] : null,
        currency: coinData.market_data.roi && coinData.market_data.roi.currency ? coinData.market_data.roi.currency : vs_currency,
        percentage: coinData.market_data.roi ? coinData.market_data.roi.percentage : coinData.market_data.atl[vs_currency] > 0 ? (coinData.market_data.current_price[vs_currency] - coinData.market_data.atl[vs_currency]) * 100 / coinData.market_data.atl[vs_currency] : null,
        from: !coinData.market_data.roi ? 'atl' : null,
      }
      setCoinData({ ...coinData })
    }
  }, [vs_currency, coinData])

  const headMeta = meta(asPath, coinData)

  return (
    <>
      <Head>
        <title>{headMeta.title}</title>
        <meta name="og:site_name" property="og:site_name" content={headMeta.title} />
        <meta name="og:title" property="og:title" content={headMeta.title} />
        <meta itemProp="name" content={headMeta.title} />
        <meta itemProp="headline" content={headMeta.title} />
        <meta itemProp="publisher" content={headMeta.title} />
        <meta name="twitter:title" content={headMeta.title} />

        <meta name="description" content={headMeta.description} />
        <meta name="og:description" property="og:description" content={headMeta.description} />
        <meta itemProp="description" content={headMeta.description} />
        <meta name="twitter:description" content={headMeta.description} />

        <meta name="og:image" property="og:image" content={headMeta.image} />
        <meta itemProp="thumbnailUrl" content={headMeta.image} />
        <meta itemProp="image" content={headMeta.image} />
        <meta name="twitter:image" content={headMeta.image} />
        <link rel="image_src" href={headMeta.image} />

        <meta name="og:url" property="og:url" content={headMeta.url} />
        <meta itemProp="url" content={headMeta.url} />
        <meta name="twitter:url" content={headMeta.url} />
        <link rel="canonical" href={headMeta.url} />
      </Head>
      <SectionTitle
        title="Cryptocurrency"
        subtitle={coinData ?
          <>
            <div className="coin-column flex items-center space-x-2 mt-1.5">
              {coinData.image && (
                <Image
                  src={coinData.image.large || coinData.image.thumb || coinData.image.small}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded"
                />
              )}
              <span className="space-x-1.5">
                <span>{coinData.name}</span>
                {coinData.symbol && (<span className={`uppercase text-gray-400 text-base font-normal ${coinData.symbol.length > 5 ? 'break-all' : ''}`}>{coinData.symbol}</span>)}
              </span>
            </div>
            <span className="flex flex-wrap items-center mt-1">
              <Badge rounded color="bg-transparent flex items-center normal-case text-gray-800 dark:text-gray-200 my-1 ml-0.5 mr-2 px-0">Rank #{coinData.market_cap_rank > -1 ? numberFormat(coinData.market_cap_rank, '0,0')  : '-'}</Badge>
              {((coinData.categories && coinData.categories.filter(category => ['cryptocurrency'].findIndex(keyword => keyword === category.toLowerCase()) < 0)) || []).concat(coinData.hashing_algorithm || []).map((tag, i) => (
                <Badge key={i} rounded color="bg-gray-200 flex items-center text-gray-700 dark:bg-gray-700 dark:text-gray-400 font-normal my-1 mr-2">{tag}</Badge>
              ))}
            </span>
          </>
          :
          getName(coin_id)
        }
        right={
          <div className="flex flex-col items-start sm:items-end my-1 ml-0 sm:ml-4 pr-1">
            {coinData ?
              <>
                <div className={`flex items-center ${coinData.market_data.price_change_percentage_24h_in_currency[currency.id] < 0 ? 'text-red-500 dark:text-red-400' : coinData.market_data.price_change_percentage_24h_in_currency[currency.id] > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-bold space-x-1.5`}>
                  <span className="text-lg space-x-1">
                    {coinData.market_data.current_price[currency.id] > -1 ?
                      <>
                        {currency.symbol}
                        <span>{numberFormat(coinData.market_data.current_price[currency.id], '0,0.0000000000')}</span>
                        {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                      </>
                      :
                      '-'
                    }
                  </span>
                  <span className="flex items-center pr-1">
                    <span className="text-sm font-normal">{numberFormat(coinData.market_data.price_change_percentage_24h_in_currency[currency.id], '+0,0.000')}%</span>
                    {coinData.market_data.price_change_percentage_24h_in_currency[currency.id] < 0 ? <FiArrowDown size={14} className="ml-0.5 mb-0.5" /> : coinData.market_data.price_change_percentage_24h_in_currency[currency.id] > 0 ? <FiArrowUp size={14} className="ml-0.5 mb-0.5" /> : null}
                  </span>
                </div>
                <div className="flex flex-wrap items-center">
                  {_.slice(getTrades(coinData, all_crypto_data, coinData.tickers), 0, 3).map((tickerData, i) => (
                    <a key={i} href={tickerData.url} target="_blank" rel="noopener noreferrer" className={`btn btn-raised min-w-max btn-rounded flex items-center bg-transparent hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:text-white dark:hover:text-gray-200 text-xs space-x-1.5 my-1 ${i < 3 - 1 ? 'mr-2 md:mr-3' : ''} p-2`}>
                      {tickerData.exchange && tickerData.exchange.large && (
                        <Image
                          src={tickerData.exchange.large}
                          alt=""
                          width={16}
                          height={16}
                          className="rounded"
                        />
                      )}
                      <span className="hidden sm:block">{tickerData.exchange.name || getName(tickerData.exchange.id)}</span>
                    </a>
                  ))}
                  <DropdownExchange data={_.slice(getTrades(coinData, all_crypto_data, coinData.tickers), 3)} />
                </div>
              </>
              :
              <>
              <div className="skeleton w-32 h-8 rounded my-1 ml-0 sm:ml-auto" />
              <div className="flex flex-wrap items-center">
                {[...Array(3).keys()].map(i => (
                  <div key={i} className={`skeleton w-8 sm:w-28 h-8 rounded my-1 mr-${i < 3 - 1 ? 2 : 0}`} />
                ))}
              </div>
              </>
            }
          </div>
        }
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
        subTitleClassName="min-w-0 max-w-screen-sm"
      />
      {/*<Coin coinData={coinData} />*/}
    </>
  )
}