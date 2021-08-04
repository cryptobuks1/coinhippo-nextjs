import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Datatable from '../../components/datatable'
import Image from '../../components/image'
import { Badge } from '../../components/badges'
import _ from 'lodash'
import { derivatives } from '../../lib/api/coingecko'
import { navigation, currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { getName, numberFormat } from '../../lib/utils'

const min_open_interest = 1000000

const Derivatives = ({ navigationData, navigationItemData }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { all_crypto_data, exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { derivative_type } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [derivativesData, setDerivativesData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getDerivatives = async () => {
      const response = await derivatives({ derivative_type: 'unexpired' })

      if (Array.isArray(response)) {
        if (mountedRef.current) {
          setDerivativesData({
            data: response.filter(derivativeData => (!derivative_type || derivativeData.contract_type === derivative_type) && derivativeData.open_interest > min_open_interest)
              .map(derivativeData => {
                return {
                  ...derivativeData,
                  price: typeof derivativeData.price === 'string' ? Number(derivativeData.price) : typeof derivativeData.price === 'number' ? derivativeData.price : -1,
                  index: typeof derivativeData.index === 'string' ? Number(derivativeData.index) : typeof derivativeData.index === 'number' ? derivativeData.index : -1,
                  basis: typeof derivativeData.basis === 'string' ? Number(derivativeData.basis) : typeof derivativeData.basis === 'number' ? derivativeData.basis : Number.MIN_SAFE_INTEGER,
                  spread: typeof derivativeData.spread === 'string' ? Number(derivativeData.spread) : typeof derivativeData.spread === 'number' ? derivativeData.spread : -1,
                  funding_rate: typeof derivativeData.funding_rate === 'string' ? Number(derivativeData.funding_rate) : typeof derivativeData.funding_rate === 'number' ? derivativeData.funding_rate : Number.MIN_SAFE_INTEGER,
                  open_interest: typeof derivativeData.open_interest === 'string' ? Number(derivativeData.open_interest) : typeof derivativeData.open_interest === 'number' ? derivativeData.open_interest : -1,
                  volume_24h: typeof derivativeData.volume_24h === 'string' ? Number(derivativeData.volume_24h) : typeof derivativeData.volume_24h === 'number' ? derivativeData.volume_24h : -1,
                }
              }),
            derivative_type,
          })
        }
      }
    }

    if (!pathname.endsWith('/[derivative_type]') || (derivative_type && navigationData.items.findIndex(item => item.url === _asPath) > -1)) {
      getDerivatives()
    }

    const interval = setInterval(() => getDerivatives(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [derivative_type])

  if (!navigationData) {
    navigation.forEach(nav => {
      if (nav.url === '/derivatives') navigationData = nav
      else if (nav.items) {
        nav.items.forEach(nav_1 => {
          if (nav_1.url === '/derivatives') navigationData = nav_1
        })
      }
    })
  }

  if (typeof window !== 'undefined' && navigationData && navigationData.items && navigationData.items[0] &&
    pathname.endsWith('/[derivative_type]') && derivative_type && navigationData.items.findIndex(item => item.url === _asPath) < 0) {
    router.push(navigationData.items[0].url)
  }

  return (!derivativesData || derivative_type === derivativesData.derivative_type) && (
    <div className="mx-1">
      <div className="flex flex-col sm:flex-row items-start space-y-1 sm:space-y-0 space-x-0 sm:space-x-4 mb-2 ml-0.5">
        {derivativesData ?
          <>
            <span className="flex items-center space-x-1">
              <span className="text-gray-400 dark:text-gray-600 font-normal">Contracts:</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{numberFormat(derivativesData.data.length, '0,0')}</span>
            </span>
            <span className="flex flex-wrap items-center justify-start sm:justify-end space-x-1">
              <span className="text-gray-400 dark:text-gray-600 font-normal">Open Interest:</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium space-x-1">
                {(exchange_rates_data ? currency : currencyUSD).symbol}
                <span>{numberFormat(_.sumBy(derivativesData.data.filter(derivativeData => derivativeData.open_interest > 0), 'open_interest') * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0')}</span>
                {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
              </span>
              {exchange_rates_data && vs_currency !== currencyUSD.id && (
                <div className="text-gray-400 dark:text-gray-600 text-xs font-medium space-x-1">
                  (
                  <span>{numberFormat(_.sumBy(derivativesData.data.filter(derivativeData => derivativeData.open_interest > 0), 'open_interest'), '0,0')}</span>
                  <span className="uppercase">{currencyUSD.id}</span>
                  )
                </div>
              )}
            </span>
            <span className="flex flex-wrap items-center justify-start sm:justify-end space-x-1">
              <span className="text-gray-400 dark:text-gray-600 font-normal">24h Vol:</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium space-x-1">
                {(exchange_rates_data ? currency : currencyUSD).symbol}
                <span>{numberFormat(_.sumBy(derivativesData.data.filter(derivativeData => derivativeData.volume_24h > 0), 'volume_24h') * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0')}</span>
                {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
              </span>
              {exchange_rates_data && vs_currency !== currencyUSD.id && (
                <div className="text-gray-400 dark:text-gray-600 text-xs font-medium space-x-1">
                  (
                  <span>{numberFormat(_.sumBy(derivativesData.data.filter(derivativeData => derivativeData.volume_24h > 0), 'volume_24h'), '0,0')}</span>
                  <span className="uppercase">{currencyUSD.id}</span>
                  )
                </div>
              )}
            </span>
          </>
          :
          <>
            <div className="skeleton w-24 h-4 rounded mr-3 sm:mr-6 mb-0.5" />
            <div className="skeleton w-48 h-4 rounded mb-0.5" />
          </>
        }
      </div>
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            Cell: props => (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                {!props.row.original.skeleton ?
                  numberFormat(props.value + 1, '0,0')
                  :
                  <div className="skeleton w-4 h-3 rounded" />
                }
              </div>
            ),
            headerClassName: 'justify-center',
          },
          {
            Header: 'Exchange',
            accessor: 'market',
            Cell: props => {
              const exchangeIndex = all_crypto_data && all_crypto_data.exchanges && props.value ? all_crypto_data.exchanges.findIndex(exchangeData => exchangeData.name.toLowerCase() === props.value.toLowerCase()) : -1
              const exchangeData = exchangeIndex > -1 && all_crypto_data.exchanges[exchangeIndex]
              if (exchangeData && exchangeData.large) {
                exchangeData.image = exchangeData.large
              }

              return (
                <>
                  {all_crypto_data && !props.row.original.skeleton ?
                    <Link href={`/exchange${exchangeData && exchangeData.id ? `/${exchangeData.id}` : 's/derivatives'}`}>
                      <a className="flex flex-col text-blue-600 dark:text-blue-400 text-xs font-normal">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={exchangeData && exchangeData.image}
                            alt=""
                            width={24}
                            height={24}
                            className="rounded"
                          />
                          <span>{props.value}</span>
                        </div>
                        <span className="text-gray-400 text-xs font-normal">
                          {getName(exchangeData.exchange_type)}
                        </span>
                      </a>
                    </Link>
                    :
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="skeleton w-6 h-6 rounded mr-2" />
                        <div className="skeleton w-24 h-4 rounded" />
                      </div>
                      <div className="skeleton w-20 h-3 rounded mt-1" />
                    </div>
                  }
                </>
              )
            },
          },
          {
            Header: 'Pairs',
            accessor: 'symbol',
            Cell: props => (
              <div className="text-gray-800 dark:text-gray-200 font-medium ml-2 lg:ml-4">
                {all_crypto_data && !props.row.original.skeleton ?
                  props.value
                  :
                  <div className="skeleton w-20 h-4 rounded" />
                }
              </div>
            ),
            headerClassName: 'ml-2 lg:ml-4',
          },
          {
            Header: 'Price',
            accessor: 'price',
            sortType: (rowA, rowB) => rowA.original.price > rowB.original.price ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {exchange_rates_data && vs_currency !== currencyUSD.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value, '0,0.00000000')}</span>
                            <span className="uppercase">{currencyUSD.id}</span>
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
            accessor: 'price_percentage_change_24h',
            sortType: (rowA, rowB) => rowA.original.price_percentage_change_24h > rowB.original.price_percentage_change_24h ? 1 : -1,
            Cell: props => (
              <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium text-right mr-2`}>
                {!props.row.original.skeleton ?
                  `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Index Price',
            accessor: 'index',
            sortType: (rowA, rowB) => rowA.original.index > rowB.original.index ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      numberFormat(props.value, '0,0.00000000')
                      :
                      '-'
                    }
                  </>
                  :
                  <div className="skeleton w-28 h-4 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Basis',
            accessor: 'basis',
            sortType: (rowA, rowB) => rowA.original.basis > rowB.original.basis ? 1 : -1,
            Cell: props => (
              <div className="text-gray-400 dark:text-gray-500 font-normal text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ? `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Spread',
            accessor: 'spread',
            sortType: (rowA, rowB) => rowA.original.spread > rowB.original.spread ? 1 : -1,
            Cell: props => (
              <div className="text-gray-400 dark:text-gray-500 font-normal text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > -1 ? `${numberFormat(props.value, `0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: (<span style={{ fontSize: '.65rem' }}>Funding Rate</span>),
            accessor: 'funding_rate',
            sortType: (rowA, rowB) => rowA.original.funding_rate > rowB.original.funding_rate ? 1 : -1,
            Cell: props => (
              <div className="text-gray-400 dark:text-gray-500 font-normal text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ? `${numberFormat(props.value, `0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: (<span style={{ fontSize: '.65rem' }}>24h Open Interest</span>),
            accessor: 'open_interest',
            sortType: (rowA, rowB) => rowA.original.open_interest > rowB.original.open_interest ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyUSD.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {exchange_rates_data && vs_currency !== currencyUSD.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
                            <span className="uppercase">{currencyUSD.id}</span>
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
            Header: (<span style={{ fontSize: '.65rem' }}>24h Volume</span>),
            accessor: 'volume_24h',
            sortType: (rowA, rowB) => rowA.original.volume_24h > rowB.original.volume_24h ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyUSD.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {exchange_rates_data && vs_currency !== currencyUSD.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
                            <span className="uppercase">{currencyUSD.id}</span>
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
        ].filter(column => !((derivative_type === 'futures' ? ['funding_rate'] : []).includes(column.accessor)))}
        data={derivativesData ? derivativesData.data.map((derivativeData, i) => { return { ...derivativeData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
        defaultPageSize={100}
        className="striped"
      />
    </div>
  )
}

Derivatives.propTypes = {
  navigationData: PropTypes.any,
  navigationItemData: PropTypes.any,
}

export default Derivatives