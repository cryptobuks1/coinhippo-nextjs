import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Summary from './summary'
import Datatable from '../../components/datatable'
import Image from '../../components/image'
import { Badge } from '../../components/badges'
import { ProgressBar, ProgressBarWithText } from '../../components/progress-bars'
import { Pagination } from '../../components/pagination'
import { MdArrowDropUp } from 'react-icons/md'
import _ from 'lodash'
import { coinsMarkets, categoriesMarkets } from '../../lib/api/coingecko'
import { navigations, currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { generateUrl, numberFormat } from '../../lib/utils'

const Coins = ({ navigationData, navigationItemData, watchlistData, addCoinsButton }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { all_crypto_data, exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyBTC = currencies[currencies.findIndex(c => c.id === 'btc')]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { view, n } = { ...query }
  let { coin_type, watchlist_id, page } = { ...query }
  const _asPath = (asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath).replace(`/${watchlist_id ? watchlist_id : ''}`, watchlist_id ? '' : '/')
  coin_type = !coin_type && !pathname.endsWith('/[coin_type]') ? _.last(_asPath.split('/')) : coin_type
  coin_type = ['coins'].includes(coin_type) ? '' : coin_type
  page = !(['categories'].includes(coin_type)) ? !isNaN(page) && Number(page) > 0 ? Number(page) : typeof page === 'undefined' ? 1 : -1 : -1

  const per_page = coin_type && !(['high-volume'].includes(coin_type)) ? Number(n) > 0 ? Number(n) < 10 ? 10 : Number(n) > 50 ? 50 : Number(n) : 50 : Number(n) > 0 ? Number(n) < 10 ? 10 : Number(n) > 100 ? 100 : Number(n) : 100

  const [coinsData, setCoinsData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getCoins = async () => {
      let data

      for (let i = 0; i < (coin_type && !(['high-volume', 'categories', 'watchlist'].includes(coin_type)) ? 10 : 1); i++) {
        const response = !(watchlistData && watchlistData.coin_ids && watchlistData.coin_ids.length > 0) && ['watchlist'].includes(coin_type) ?
          []
          :
          await (coin_type === 'categories' ?
            categoriesMarkets()
            :
            coinsMarkets({
              vs_currency,
              ids: watchlistData && watchlistData.coin_ids && watchlistData.coin_ids.length > 0 ? watchlistData.coin_ids.join(',') : undefined,
              category: coin_type && !(['high-volume', 'watchlist'].includes(coin_type)) ? coin_type : undefined,
              order: ['high-volume'].includes(coin_type) ? 'volume_desc' : 'market_cap_desc',
              per_page,
              page: coin_type && !(['high-volume'].includes(coin_type)) ? i + 1 : page,
              price_change_percentage: '24h,7d,30d',
            })
          )

        if (Array.isArray(response)) {
          data = (
            _.orderBy(
              _.uniqBy(_.concat(data || [], response), 'id')
              .map(coinData => {
                return {
                  ...coinData,
                  market_cap_rank: typeof coinData.market_cap_rank === 'string' ? Number(coinData.market_cap_rank) : typeof coinData.market_cap_rank === 'number' ? coinData.market_cap_rank : Number.MAX_SAFE_INTEGER,
                  current_price: typeof coinData.current_price === 'string' ? Number(coinData.current_price) : typeof coinData.current_price === 'number' ? coinData.current_price : -1,
                  price_change_percentage_24h_in_currency: typeof coinData.price_change_percentage_24h_in_currency === 'string' ? Number(coinData.price_change_percentage_24h_in_currency) : typeof coinData.price_change_percentage_24h_in_currency === 'number' ? coinData.price_change_percentage_24h_in_currency : Number.MIN_SAFE_INTEGER,
                  price_change_percentage_7d_in_currency: typeof coinData.price_change_percentage_7d_in_currency === 'string' ? Number(coinData.price_change_percentage_7d_in_currency) : typeof coinData.price_change_percentage_7d_in_currency === 'number' ? coinData.price_change_percentage_7d_in_currency : Number.MIN_SAFE_INTEGER,
                  price_change_percentage_30d_in_currency: typeof coinData.price_change_percentage_30d_in_currency === 'string' ? Number(coinData.price_change_percentage_30d_in_currency) : typeof coinData.price_change_percentage_30d_in_currency === 'number' ? coinData.price_change_percentage_30d_in_currency : Number.MIN_SAFE_INTEGER,
                  roi: {
                    ...coinData.roi,
                    times: coinData.roi ? coinData.roi.times : coinData.atl > 0 ? (coinData.current_price - coinData.atl) / coinData.atl : null,
                    currency: coinData.roi && coinData.roi.currency ? coinData.roi.currency : vs_currency,
                    percentage: coinData.roi ? coinData.roi.percentage : coinData.atl > 0 ? (coinData.current_price - coinData.atl) * 100 / coinData.atl : null,
                    from: !coinData.roi ? 'atl' : null,
                  },
                  market_cap: typeof coinData.market_cap === 'string' ? Number(coinData.market_cap) : typeof coinData.market_cap === 'number' ? coinData.market_cap : -1,
                  market_cap_change_24h: typeof coinData.market_cap_change_24h === 'string' ? Number(coinData.market_cap_change_24h) : typeof coinData.market_cap_change_24h === 'number' ? coinData.market_cap_change_24h : Number.MIN_SAFE_INTEGER,
                  fully_diluted_valuation: typeof coinData.fully_diluted_valuation === 'string' ? Number(coinData.fully_diluted_valuation) : typeof coinData.fully_diluted_valuation === 'number' ? coinData.fully_diluted_valuation : (coinData.current_price * (coinData.max_supply || coinData.total_supply || coinData.circulating_supply)) || -1,
                  circulating_supply: typeof coinData.circulating_supply === 'string' ? Number(coinData.circulating_supply) : typeof coinData.circulating_supply === 'number' ? coinData.circulating_supply : -1,
                  total_volume: typeof coinData.total_volume === 'string' ? Number(coinData.total_volume) : typeof coinData.total_volume === 'number' ? coinData.total_volume : -1,
                  volume_24h: typeof coinData.volume_24h === 'string' ? Number(coinData.volume_24h) : typeof coinData.volume_24h === 'number' ? coinData.volume_24h : -1,
                }
              }),
              [['high-volume'].includes(coin_type) ? 'total_volume' : ['categories'].includes(coin_type) ? 'market_cap' : 'market_cap_rank'], [['high-volume', 'categories'].includes(coin_type) ? 'desc' : 'asc']
            )
          )

          if (data) {
            data = data.map(coinData => {
              return {
                ...coinData,
                market_share: coinData.volume_24h > -1 ? coinData.volume_24h / _.sumBy(data.filter(_coinData => _coinData.volume_24h > 0), 'volume_24h') : -1,
              }
            })

            if (mountedRef.current) {
              setCoinsData({ data, coin_type, vs_currency: coin_type === 'categories' ? currencyUSD.id : vs_currency, page, watchlist_id: watchlistData ? watchlistData.id : null })
            }
          }

          if (response.length < per_page) {
            break
          }
        }
      }
    }

    if ((all_crypto_data || watchlistData) && (coin_type === 'categories' || page > -1) &&
      (
        (
          ['/coins', '/watchlist', '/[watchlist_id]'].findIndex(path => pathname.endsWith(path)) > -1 ||
          (coin_type && (
            ((navigationData && navigationData.items.findIndex(item => item.url === _asPath) > -1)) ||
            (all_crypto_data && all_crypto_data.categories && all_crypto_data.categories.findIndex(categoryData => categoryData.category_id === coin_type) > -1)
          ))
        )
      )
    ) {
      getCoins()
    }

    const interval = setInterval(() => getCoins(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [all_crypto_data, vs_currency, coin_type, page, watchlistData])

  if (!navigationData && !(['watchlist'].includes(coin_type))) {
    navigations.forEach(nav => {
      if (nav.url === '/coins') navigationData = nav
      else if (nav.items) {
        nav.items.forEach(nav_1 => {
          if (nav_1.url === '/coins') navigationData = nav_1
        })
      }
    })
  }

  if (typeof window !== 'undefined') {
    if (navigationData && navigationData.items && navigationData.items[0] &&
      !pathname.endsWith('/coins') && coin_type &&
      navigationData.items.findIndex(item => item.url === _asPath) < 0 &&
      all_crypto_data && all_crypto_data.categories && all_crypto_data.categories.findIndex(categoryData => categoryData.category_id === coin_type) < 0
    ) {
      router.push(generateUrl(navigationData.items[0].url, query, ['coin_type', 'page']))
    }
    else if (!(['watchlist'].includes(coin_type)) && ['?', 'page='].findIndex(keyword => !(asPath.includes(keyword))) < 0 && page < 0) {
      router.push(generateUrl(_asPath, query, ['coin_type', 'page']))
    }
  }

  const isWidget = ['widget'].includes(view)

  return (
    <div className={`${isWidget ? 'max-w-2xl' : ''} mx-1`}>
      {pathname.endsWith('/[coin_type]') && !isWidget && (
        <Summary coinsData={coinsData} page={page} />
      )}
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: coin_type === 'categories' ? 'i' : 'market_cap_rank',
            sortType: (rowA, rowB) => rowA.original[coin_type === 'categories' ? 'i' : 'market_cap_rank'] > rowB.original[coin_type === 'categories' ? 'i' : 'market_cap_rank'] ? 1 : -1,
            Cell: props => (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                {!props.row.original.skeleton ?
                  (coin_type === 'categories' ? props.value > -1 : props.value < Number.MAX_SAFE_INTEGER) ?
                    numberFormat(props.value + (coin_type === 'categories' ? 1 : 0), '0,0')
                    :
                    '-'
                  :
                  <div className="skeleton w-4 h-3 rounded" />
                }
              </div>
            ),
            headerClassName: 'justify-center',
          },
          {
            Header: coin_type === 'categories' ? 'Category' : 'Coin',
            accessor: 'name',
            Cell: props => (
              !props.row.original.skeleton ?
                <Link href={`/coin${props.row.original.id ? `${coin_type === 'categories' ? 's' : ''}/${props.row.original.id}` : 's'}`}>
                  <a target={isWidget ? '_blank' : '_self'} rel={isWidget ? 'noopener noreferrer' : ''} className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold" style={{ maxWidth: coin_type === 'categories' ? 'unset' : '10rem' }}>
                    <div className="coin-column flex items-center space-x-2">
                      {coin_type !== 'categories' && (
                        <Image
                          useImg={coinsData.data.length > per_page}
                          src={props.row.original.image}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded"
                        />
                      )}
                      <span className="space-x-1">
                        <span>{props.value}</span>
                        {props.row.original.symbol && (<span className={`uppercase text-gray-400 font-normal ${props.row.original.symbol.length > 5 ? 'break-all' : ''}`}>{props.row.original.symbol}</span>)}
                      </span>
                    </div>
                  </a>
                </Link>
                :
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {coin_type !== 'categories' && (
                      <div className="skeleton w-6 h-6 rounded mr-2" />
                    )}
                    <div className="skeleton w-24 h-4 rounded" />
                    <div className="skeleton w-8 h-4 rounded ml-1.5" />
                  </div>
                </div>
            ),
          },
          {
            Header: 'Price',
            accessor: 'current_price',
            sortType: (rowA, rowB) => rowA.original.current_price > rowB.original.current_price ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-left sm:text-right ml-0 sm:ml-auto" style={{ minWidth: '7.5rem' }}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <>
                        <span className="space-x-1">
                          {currency.symbol}
                          <span>{numberFormat(props.value, '0,0.00000000')}</span>
                          {!(currency.symbol) && (<span className="uppercase">{currency.id}</span>)}
                        </span>
                        <div className="flex items-center">
                          <span className="text-gray-400 dark:text-gray-500 font-normal space-x-1" style={{ fontSize: '.65rem' }}>
                            {currency.symbol}
                            <span>{numberFormat(props.row.original.low_24h, '0,0.00000000')}</span>
                            {!(currency.symbol) && (<span className="uppercase">{currency.id}</span>)}
                          </span>
                          <span className="text-gray-400 dark:text-gray-500 font-normal space-x-1 ml-auto" style={{ fontSize: '.65rem' }}>
                            {currency.symbol}
                            <span>{numberFormat(props.row.original.high_24h, '0,0.00000000')}</span>
                            {!(currency.symbol) && (<span className="uppercase">{currency.id}</span>)}
                          </span>
                        </div>
                        <div className="mb-1">
                          <ProgressBarWithText
                            width={props.row.original.high_24h - props.row.original.low_24h > 0 ? (props.value - props.row.original.low_24h) * 100 / (props.row.original.high_24h - props.row.original.low_24h) : 0}
                            text={props.row.original.high_24h - props.row.original.low_24h > 0 && (<MdArrowDropUp size={24} className="text-gray-200 dark:text-gray-600 mt-0.5 ml-auto" style={((props.value - props.row.original.low_24h) * 100 / (props.row.original.high_24h - props.row.original.low_24h)) <= 5 ? { marginLeft: '-.5rem' } : { marginRight: '-.5rem' }} />)}
                            color="bg-gray-200 dark:bg-gray-600 rounded"
                            backgroundClassName="h-2 bg-gray-100 dark:bg-gray-800 rounded"
                            className="h-2"
                          />
                        </div>
                      </>
                      :
                      '-'
                    }
                  </>
                  :
                  <>
                    <div className="skeleton w-20 h-4 rounded ml-0 sm:ml-auto" />
                    <div className="flex items-center mt-2">
                      <div className="skeleton w-8 h-3 rounded" />
                      <div className="skeleton w-8 h-3 rounded ml-auto" />
                    </div>
                    <div className="skeleton w-5/6 h-2 rounded my-1" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
          },
          {
            Header: '24h',
            accessor: 'price_change_percentage_24h_in_currency',
            sortType: (rowA, rowB) => rowA.original.price_change_percentage_24h_in_currency > rowB.original.price_change_percentage_24h_in_currency ? 1 : -1,
            Cell: props => (
              <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ?
                    `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
                    :
                    '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: '7d',
            accessor: 'price_change_percentage_7d_in_currency',
            sortType: (rowA, rowB) => rowA.original.price_change_percentage_7d_in_currency > rowB.original.price_change_percentage_7d_in_currency ? 1 : -1,
            Cell: props => (
              <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ?
                    `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
                    :
                    '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: '30d',
            accessor: 'price_change_percentage_30d_in_currency',
            sortType: (rowA, rowB) => rowA.original.price_change_percentage_30d_in_currency > rowB.original.price_change_percentage_30d_in_currency ? 1 : -1,
            Cell: props => (
              <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ?
                    `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
                    :
                    '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'ROI',
            accessor: 'roi.times',
            sortType: (rowA, rowB) => (rowA.original.roi ? rowA.original.roi.times : null) > (rowB.original.roi ? rowB.original.roi.times : null) ? 1 : -1,
            Cell: props => (
              <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
                {!props.row.original.skeleton ?
                  typeof props.value === 'number' ?
                    <>
                      <span>{numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}x</span>
                      <div className="text-gray-400 dark:text-gray-600 font-light" style={{ fontSize: '.65rem' }}>
                        {props.row.original.roi.from ?
                          <>from <span className="uppercase font-medium">{props.row.original.roi.from}</span></>
                          :
                          <>in <span className="uppercase font-medium">{props.row.original.roi.currency}</span></>
                        }
                      </div>
                    </>
                    :
                    '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Market Cap',
            accessor: 'market_cap',
            sortType: (rowA, rowB) => rowA.original.market_cap > rowB.original.market_cap ? 1 : -1,
            Cell: props => (
              <div className={`flex flex-col font-${!['high-volume'].includes(coin_type) ? 'semibold' : 'medium'} text-right mr-2`}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {currency.symbol}
                        <span>{numberFormat(props.value * (coin_type === 'categories' && exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0${Math.abs(props.value * (coin_type === 'categories' && exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {exchange_rates_data && currency.id !== currencyBTC.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[(coin_type === 'categories' ? currencyUSD : currency).id].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[(coin_type === 'categories' ? currencyUSD : currency).id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                            <span className="uppercase">{currencyBTC.id}</span>
                          </>
                          :
                          '-'
                        }
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: '24h',
            accessor: 'market_cap_change_24h',
            sortType: (rowA, rowB) => rowA.original.market_cap_change_24h > rowB.original.market_cap_change_24h ? 1 : -1,
            Cell: props => (
              <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium text-right mr-2`}>
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ?
                    `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
                    :
                    '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: (<span style={{ fontSize: '.65rem' }}>Fully Diluted MCap</span>),
            accessor: 'fully_diluted_valuation',
            sortType: (rowA, rowB) => rowA.original.fully_diluted_valuation > rowB.original.fully_diluted_valuation ? 1 : -1,
            Cell: props => (
              <div className={`flex flex-col font-${!['high-volume'].includes(coin_type) ? 'semibold' : 'medium'} text-right mr-2`}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {currency.symbol}
                        <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
                        {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {exchange_rates_data && currency.id !== currencyBTC.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                            <span className="uppercase">{currencyBTC.id}</span>
                          </>
                          :
                          '-'
                        }
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: '24h Volume',
            accessor: coin_type === 'categories' ? 'volume_24h' : 'total_volume',
            sortType: (rowA, rowB) => rowA.original[coin_type === 'categories' ? 'volume_24h' : 'total_volume'] > rowB.original[coin_type === 'categories' ? 'volume_24h' : 'total_volume'] ? 1 : -1,
            Cell: props => (
              <div className={`flex flex-col font-${['high-volume', 'categories'].includes(coin_type) ? 'semibold' : 'medium'} text-right mr-2`}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {currency.symbol}
                        <span>{numberFormat(props.value * (coin_type === 'categories' && exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0${Math.abs(props.value * (coin_type === 'categories' && exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {exchange_rates_data && currency.id !== currencyBTC.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[(coin_type === 'categories' ? currencyUSD : currency).id].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[(coin_type === 'categories' ? currencyUSD : currency).id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                            <span className="uppercase">{currencyBTC.id}</span>
                          </>
                          :
                          '-'
                        }
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Market Share',
            accessor: 'market_share',
            sortType: (rowA, rowB) => rowA.original.volume_24h > rowB.original.volume_24h ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col text-gray-600 dark:text-gray-400 font-normal">
                {!props.row.original.skeleton ?
                  <>
                    <span>{props.value > -1 ? `${numberFormat(props.value * 100, `0,0.000${Math.abs(props.value * 100) < 0.001 ? '000' : ''}`)}%` : '-'}</span>
                    <ProgressBar width={props.value > -1 ? props.value * 100 : 0} color="bg-yellow-500" className="h-1" />
                  </>
                  :
                  <>
                    <div className="skeleton w-10 h-3 rounded" />
                    <div className={`skeleton w-${Math.floor((12 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5`} />
                  </>
                }
              </div>
            ),
          },
          {
            Header: (<span style={{ fontSize: '.65rem' }}>Circulating Supply</span>),
            accessor: 'circulating_supply',
            sortType: (rowA, rowB) => rowA.original.circulating_supply > rowB.original.circulating_supply ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-medium text-right ml-auto">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <>
                        <span className="text-xs">
                          {numberFormat(props.value, '0,0')}
                        </span>
                        {props.row.original.max_supply && (
                          <>
                            <div className="mt-1">
                              <ProgressBarWithText
                                width={props.value * 100 / props.row.original.max_supply}
                                text={<div className="text-gray-600 dark:text-gray-400 font-normal mx-1" style={{ fontSize: props.value * 100 / props.row.original.max_supply < 25 ? '.45rem' : '.55rem' }}>{numberFormat(props.value * 100 / props.row.original.max_supply, `0,0.000${Math.abs(props.value * 100 / props.row.original.max_supply) < 0.001 ? '000' : ''}`)}%</div>}
                                color="bg-gray-200 dark:bg-gray-600 rounded"
                                backgroundClassName="h-3 bg-gray-100 dark:bg-gray-800 rounded"
                                className={`h-3 flex items-center justify-${props.value * 100 / props.row.original.max_supply < 25 ? 'start' : 'end'}`}
                              />
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-400 dark:text-gray-500 font-normal ml-auto" style={{ fontSize: '.65rem' }}>
                                <span className="font-medium mr-1">Max</span>
                                {numberFormat(props.row.original.max_supply, '0,0')}
                              </span>
                            </div>
                          </>
                        )}
                      </>
                      :
                      '-'
                    }
                  </>
                  :
                  <>
                    <div className="skeleton w-20 h-3 rounded ml-auto" />
                    <div className="skeleton w-5/6 h-3 rounded mt-2" />
                    <div className="flex items-center mt-1">
                      <div className="skeleton w-24 h-2.5 rounded ml-auto" />
                    </div>
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right',
          },
        ].filter(column => !((coin_type === 'categories' ? ['current_price', 'price_change_percentage_1h_in_currency', 'price_change_percentage_24h_in_currency', 'price_change_percentage_7d_in_currency', 'price_change_percentage_30d_in_currency', 'roi.times', 'fully_diluted_valuation', 'total_volume', 'circulating_supply'] : ['market_cap_change_24h', 'volume_24h', 'market_share']).includes(column.accessor)))
        .filter(column => isWidget ? ['i', 'market_cap_rank', 'name', 'current_price', 'price_change_percentage_24h_in_currency', 'market_cap'].includes(column.accessor) : true)}
        data={coinsData && coinsData.vs_currency === (coin_type === 'categories' ? currencyUSD.id : vs_currency) && coin_type === coinsData.coin_type && page === coinsData.page && (!watchlistData || watchlistData.id === coinsData.watchlist_id) ? coinsData.data.map((coinData, i) => { return { ...coinData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
        defaultPageSize={per_page}
        pagination={!(coin_type && !(['high-volume'].includes(coin_type))) ?
          <div className="flex flex-col sm:flex-row items-center justify-center my-4">
            <Pagination
              disabled={!(coinsData && coinsData.vs_currency === vs_currency && coin_type === coinsData.coin_type && page === coinsData.page)}
              active={page}
              items={[...Array(Math.ceil((all_crypto_data && all_crypto_data.coins ? all_crypto_data.coins.length : 10000) / per_page)).keys()]}
              previous="Previous"
              next="Next"
              onClick={page => router.push(generateUrl(_asPath, { ...query, page }))}
            />
          </div>
          :
          !(coinsData && coinsData.data.length > 10) ?
            <></>
            :
            null
        }
        className={`${coin_type === 'categories' ? 'striped' : ''}`}
      />
      {(pathname.endsWith('/watchlist') || watchlistData) && !(watchlistData && watchlistData.coin_ids && watchlistData.coin_ids.length > 0) && (
        <div className="w-full h-80 md:h-96 flex items-center justify-center">
          <div>
            <div className="text-gray-900 dark:text-white text-3xl text-center mb-4">
              You watchlist is Empty
            </div>
            <div className="text-gray-400 dark:text-gray-600 text-base text-center mb-8">
              {watchlistData && watchlistData.title ? 'Add any coins to get started' : 'Please set the watchlist name first'}
            </div>
            <div className="flex justify-center">{addCoinsButton}</div>
          </div>
        </div>
      )}
    </div>
  )
}

Coins.propTypes = {
  navigationData: PropTypes.any,
  navigationItemData: PropTypes.any,
}

export default Coins