import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Datatable from '../../components/datatable'
import { Badge } from '../../components/badges'
import { ProgressBar } from '../../components/progress-bars'
import _ from 'lodash'
import { exchanges } from '../../lib/api/coingecko'
import { navigation, currencies } from '../../lib/menus'
import { getName, numberFormat } from '../../lib/utils'

const per_page = 100
const low_threshold = 2
const high_threshold = 8

const Exchanges = ({ navigationData, navigationItemData }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { all_crypto_data, exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyBTC = currencies[currencies.findIndex(c => c.id === 'btc')]

  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { exchange_type } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [exchangesData, setExchangesData] = useState(null)

  useEffect(() => {
    const getExchanges = async () => {
      let data = null
      for (let i = 0; i < all_crypto_data && all_crypto_data.exchanges ? Math.ceil(all_crypto_data.exchanges.length / per_page) : 10; i++) {
        const response = await exchanges({ per_page, page: i + 1 })

        if (Array.isArray(response)) {
          data = (
            _.orderBy(
              _.uniqBy(_.concat(data || [], response), 'id')
              .filter(exchangeData => !exchange_type || exchangeData.exchange_type === exchange_type || (exchangeData.exchange_type === 'decentralized' && exchange_type === 'dex'))
              .map(exchangeData => {
                return {
                  ...exchangeData,
                  trade_volume_24h_btc: typeof exchangeData.trade_volume_24h_btc === 'string' ? Number(exchangeData.trade_volume_24h_btc) : typeof exchangeData.trade_volume_24h_btc === 'number' ? exchangeData.trade_volume_24h_btc : -1,
                  trust_score: typeof exchangeData.trust_score === 'string' ? Number(exchangeData.trust_score) : typeof exchangeData.trust_score === 'number' ? exchangeData.trust_score : -1,
                }
              })
              , [exchange_type ? 'trade_volume_24h_btc' : 'trust_score'], ['desc']
            )
          )

          if (response.length < per_page) {
            break
          }
        }
      }

      if (data) {
        data = data.map(exchangeData => {
          return { ...exchangeData, market_share: exchangeData.trade_volume_24h_btc > -1 ? exchangeData.trade_volume_24h_btc / _.sumBy(data.filter(_exchangeData => _exchangeData.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') : -1 }
        })

        setExchangesData({ data, exchange_type })
      }
    }

    if (!pathname.endsWith('/[exchange_type]') || (exchange_type && navigationData.items.findIndex(item => item.url === _asPath) > -1)) {
      getExchanges()
    }
  }, [exchange_type])

  if (!navigationData) {
    navigation.forEach(nav => {
      if (nav.url === '/exchanges') navigationData = nav
      else if (nav.items) {
        nav.items.forEach(nav_1 => {
          if (nav_1.url === '/exchanges') navigationData = nav_1
        })
      }
    })
  }

  if (typeof window !== 'undefined' && navigationData && navigationData.items && navigationData.items[0] &&
    pathname.endsWith('/[exchange_type]') && exchange_type && navigationData.items.findIndex(item => item.url === _asPath) < 0) {
    router.push(navigationData.items[0].url)
  }

  return (!exchangesData || exchange_type === exchangesData.exchange_type) && (
    <div className="mx-1">
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            Cell: props => (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                {!props.row.original.skeleton ?
                  props.value + 1
                  :
                  <div className="skeleton w-4 h-3 rounded" />
                }
              </div>
            ),
            headerClassName: 'justify-center',
          },
          {
            Header: 'Exchange',
            accessor: 'name',
            Cell: props => (
              !props.row.original.skeleton ?
                <Link href={`/exchange${props.row.original.id ? `/${props.row.original.id}` : 's'}`}>
                  <a className="flex flex-col font-semibold">
                    <div className="flex items-center">
                      <img
                        src={props.row.original.image}
                        alt=""
                        className="w-6 h-6 rounded mr-2"
                      />
                      {props.value}
                    </div>
                    <span className="text-gray-400 text-xs font-normal">
                      {getName(props.row.original.exchange_type)}
                    </span>
                    <span className="mt-1">
                      {props.row.original.country && (
                        <Badge size="sm" rounded color="bg-blue-500 text-gray-100 dark:bg-blue-900 mr-1.5">{props.row.original.country}</Badge>
                      )}
                      {props.row.original.year_established && (
                        <Badge size="sm" rounded color="bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200">{props.row.original.year_established}</Badge>
                      )}
                    </span>
                  </a>
                </Link>
                :
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="skeleton w-6 h-6 rounded mr-2.5" />
                    <div className="skeleton w-24 h-4 rounded" />
                  </div>
                  <div className="skeleton w-20 h-3 rounded mt-1" />
                  <span className="flex items-center mt-2">
                    <div className="skeleton w-24 h-3.5 rounded mr-1.5" />
                    <div className="skeleton w-10 h-3.5 rounded" />
                  </span>
                </div>
            ),
          },
          {
            Header: '24h Volume',
            accessor: 'trade_volume_24h_btc',
            sortType: 'number',
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <>
                        {(exchange_rates_data ? currency : currencyBTC).symbol}
                        {numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data.btc.value : 1), `0,0${props.value < 1 ? '.000' : ''}`)}
                        {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<>&nbsp;{(exchange_rates_data ? currency : currencyBTC).id.toUpperCase()}</>)}
                      </>
                      :
                      '-'
                    }
                    {exchange_rates_data && vs_currency !== 'btc' && (
                      <span className="text-gray-400 text-xs font-medium">
                        {props.value > -1 ?
                          <>{numberFormat(props.value, `0,0${props.value < 1 ? '.000' : ''}`)}&nbsp;BTC</>
                          :
                          '-'
                        }
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
          {
            Header: 'Market Share',
            accessor: 'market_share',
            sortType: 'number',
            Cell: props => (
              <div className="flex flex-col text-gray-600 dark:text-gray-400 font-normal">
                {!props.row.original.skeleton ?
                  <>
                    <span>{props.value > -1 ? `${numberFormat(props.value * 100, `0,0.000${props.value < 0.00001 ? '000' : ''}`)}%` : '-'}</span>
                    <ProgressBar width={props.value > -1 ? props.value * 100 : 0} color="bg-yellow-500" className="h-1" />
                  </>
                  :
                  <>
                    <div className="skeleton w-10 h-3 rounded" />
                    <div className={`skeleton w-${Math.floor((10 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5`} />
                  </>
                }
              </div>
            ),
          },
          {
            Header: 'Confidence',
            accessor: 'trust_score',
            sortType: 'number',
            Cell: props => {
              const color = props.value <= low_threshold ? 'red-600' :
                props.value >= high_threshold ? 'green-500' :
                props.value < 5 ?
                  props.value <= (5 - low_threshold) / 2 ? 'red-500' : 'yellow-600' :
                  props.value > 5 ? props.value >= 5 + ((high_threshold - 5) / 2) ? 'green-400' : 'yellow-400' :
                'yellow-500'

              return (
                <div className={`flex flex-col text-${color} font-medium`}>
                  {!props.row.original.skeleton ?
                    <>
                      <span>{props.value > -1 ? numberFormat(props.value, '0,0') : '-'}</span>
                      <ProgressBar width={props.value > -1 ? props.value * 100 / 10 : 0} color={`bg-${color}`} className="h-1" />
                    </>
                    :
                    <>
                      <div className="skeleton w-4 h-3 rounded" />
                      <div className={`skeleton w-${Math.floor(12 - (props.row.original.i / 10))}/12 h-1 rounded mt-1.5`} />
                    </>
                  }
                </div>
              )
            },
          },
          {
            Header: 'Action',
            accessor: 'url',
            disableSortBy: true,
            Cell: props => (
              <div className="flex items-center justify-end mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  props.value ?
                    <a href={props.value} target="_blank" rel="noopener noreferrer" className="btn btn-raised min-w-max btn-rounded bg-indigo-500 hover:bg-indigo-600 text-white hover:text-gray-50 text-xs text-right my-1 p-2">
                      Start Trading
                    </a>
                    :
                    <Link href={`/exchange${props.row.original.id ? `/${props.row.original.id}` : 's'}`}>
                      <a className="btn btn-raised min-w-max btn-rounded bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-gray-100 text-xs text-right my-1 p-2">
                        See More
                      </a>
                    </Link>
                  :
                  <div className="skeleton w-28 h-8 rounded" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
        ]}
        data={exchangesData ? exchangesData.data.map((exchangeData, i) => { return { ...exchangeData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
        defaultPageSize={pathname.endsWith('/[exchange_type]') ? 50 : 100}
        className="striped"
      />
    </div>
  )
}

Exchanges.propTypes = {
  navigationData: PropTypes.any,
  navigationItemData: PropTypes.any,
}

export default Exchanges