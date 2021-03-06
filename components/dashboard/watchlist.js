import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Widget from '../widget'
import Datatable from '../datatable'
import Image from '../image'
import { FaStar } from 'react-icons/fa'
import { BiChevronDown } from 'react-icons/bi'
import _ from 'lodash'
import { coinsMarkets } from '../../lib/api/coingecko'
import { currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { numberFormat } from '../../lib/utils'

const per_page = 100

export default function Watchlist({ noBorder }) {
  const { preferences, data, watchlist } = useSelector(state => ({ preferences: state.preferences, data: state.data, watchlist: state.watchlist }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const { watchlists_data } = { ...watchlist }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyBTC = currencies[currencies.findIndex(c => c.id === 'btc')]

  const [watchlistData, setWatchlistData] = useState((watchlists_data || [])[0])
  const [coinsData, setCoinsData] = useState(null)
  const [hidden, setHidden] = useState(true)

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        hidden ||
        buttonRef.current.contains(event.target) ||
        dropdownRef.current.contains(event.target)
      ) {
        return false
      }
      setHidden(!hidden)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const handleDropdownClick = () => setHidden(!hidden)

  useEffect(() => {
    if (watchlists_data) {
      if (!watchlistData || watchlists_data.findIndex(_watchlistData => _watchlistData.id === watchlistData.id) < 0) {
        setWatchlistData(watchlists_data[0])
      }
    }
  }, [watchlists_data])

  useEffect(() => {
    const getCoins = async () => {
      let data

      const response = !(watchlistData && watchlistData.coin_ids && watchlistData.coin_ids.length > 0) ?
        []
        :
        await coinsMarkets({
          vs_currency,
          ids: watchlistData && watchlistData.coin_ids && watchlistData.coin_ids.length > 0 ? watchlistData.coin_ids.join(',') : undefined,
          order: 'market_cap_desc',
          per_page,
          price_change_percentage: '24h,7d,30d',
        })

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
                fully_diluted_valuation: typeof coinData.fully_diluted_valuation === 'string' ? Number(coinData.fully_diluted_valuation) : typeof coinData.fully_diluted_valuation === 'number' ? coinData.fully_diluted_valuation : (coinData.current_price * (coinData.max_supply || coinData.total_supply || coinData.circulating_supply)) || -1,
                circulating_supply: typeof coinData.circulating_supply === 'string' ? Number(coinData.circulating_supply) : typeof coinData.circulating_supply === 'number' ? coinData.circulating_supply : -1,
                total_volume: typeof coinData.total_volume === 'string' ? Number(coinData.total_volume) : typeof coinData.total_volume === 'number' ? coinData.total_volume : -1,
              }
            }),
            ['market_cap_rank'], ['asc']
          )
        )

        if (data) {
          if (mountedRef.current) {
            setCoinsData({ data, vs_currency, watchlist_id: watchlistData ? watchlistData.id : null })
          }
        }
      }
    }

    if (watchlistData) {
      getCoins()
    }

    const interval = setInterval(() => getCoins(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [vs_currency, watchlistData])

  return watchlists_data && watchlists_data.length > 0 && (
    <Widget
      title={<span className="h-8 uppercase flex items-center">
        <Link href="/watchlist">
          <a className="flex items-center">
            <FaStar size={20} className="stroke-current text-yellow-500 mb-0.5" />
            <span className="font-semibold ml-1.5">Watchlist</span>
          </a>
        </Link>
        <div className="text-gray-700 dark:text-gray-300 font-semibold ml-auto">
          {watchlists_data.length === 1 ?
            watchlists_data[0].title
            :
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleDropdownClick}
                className="btn btn-flat btn-rounded h-8 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center p-2"
              >
                <span className="break-all">{watchlistData && watchlistData.title}</span>
                <BiChevronDown size={16} className="ml-0.5 mb-0.5" />
              </button>
              <div
                ref={dropdownRef} 
                className={`dropdown ${hidden ? '' : 'open'} absolute top-0 right-0 mt-8`}
              >
                <div className="dropdown-content w-48 bottom-start">
                  <div className="dropdown-title text-left">Change Watchlist</div>
                  <div className="flex flex-wrap pb-1">
                    {watchlists_data.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setWatchlistData(item)
                          handleDropdownClick()
                        }}
                        className="dropdown-item w-full flex items-center justify-start py-2 px-3"
                      >
                        <span className="break-all text-gray-500 dark:text-gray-300 text-xs font-medium text-left">{item.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </span>}
      description={<div className="mt-3.5">
        <Datatable
          columns={[
            {
              Header: '#',
              accessor: 'market_cap_rank',
              sortType: (rowA, rowB) => rowA.original.market_cap_rank > rowB.original.market_cap_rank ? 1 : -1,
              Cell: props => (
                <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                  {!props.row.original.skeleton ?
                    props.value < Number.MAX_SAFE_INTEGER ?
                      numberFormat(props.value, '0,0')
                      :
                      '-'
                    :
                    <div className="skeleton w-4 h-3 rounded" />
                  }
                </div>
              ),
              headerClassName: 'justify-center',
              className: 'nopadding-right-column'
            },
            {
              Header: 'Coin',
              accessor: 'name',
              Cell: props => (
                !props.row.original.skeleton ?
                  <Link href={`/coin${props.row.original.id ? `/${props.row.original.id}` : 's'}`}>
                    <a className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold" style={{ maxWidth: '5rem' }}>
                      <div className="coin-column flex items-center space-x-1" style={{ fontSize: '.65rem' }}>
                        <Image
                          useImg={coinsData.data.length > per_page}
                          src={props.row.original.image}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="space-x-1">
                          <span className={`${props.value && props.value.length > 15 ? '' : 'whitespace-pre'}`}>{props.value}</span>
                          {props.row.original.symbol && (<span className={`uppercase text-gray-400 font-normal ${props.row.original.symbol.length > 6 ? 'break-all' : ''}`}>{props.row.original.symbol}</span>)}
                        </span>
                      </div>
                    </a>
                  </Link>
                  :
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <div className="skeleton w-6 h-6 rounded mr-1" />
                      <div className="skeleton w-16 h-4 rounded" />
                      <div className="skeleton w-6 h-4 rounded ml-1" />
                    </div>
                  </div>
              ),
              className: 'nopadding-right-column'
            },
            {
              Header: 'Price',
              accessor: 'current_price',
              sortType: (rowA, rowB) => rowA.original.price_change_percentage_24h_in_currency > rowB.original.price_change_percentage_24h_in_currency ? 1 : -1,
              Cell: props => (
                <div className="flex flex-col font-semibold text-right ml-auto" style={{ fontSize: '.65rem' }}>
                  {!props.row.original.skeleton ?
                    <>
                      {props.value > -1 ?
                        <span className="space-x-1">
                          {currency.symbol}
                          <span>{numberFormat(props.value, '0,0.00000000')}</span>
                          {!(currency.symbol) && (<span className="uppercase">{currency.id}</span>)}
                        </span>
                        :
                        '-'
                      }
                      <div className={`${props.row.original.price_change_percentage_24h_in_currency < 0 ? 'text-red-500 dark:text-red-400' : props.row.original.price_change_percentage_24h_in_currency > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium text-right`}>
                        {props.row.original.price_change_percentage_24h_in_currency > Number.MIN_SAFE_INTEGER ?
                          `${numberFormat(props.row.original.price_change_percentage_24h_in_currency, `+0,0.000${Math.abs(props.row.original.price_change_percentage_24h_in_currency) < 0.001 ? '000' : ''}`)}%`
                          :
                          '-'
                        }
                      </div>
                    </>
                    :
                    <>
                      <div className="skeleton w-12 h-4 rounded ml-auto" />
                      <div className="skeleton w-6 h-3 rounded mt-1.5 ml-auto" />
                    </>
                  }
                </div>
              ),
              headerClassName: 'justify-end text-right',
              className: 'nopadding-right-column'
            },
            {
              Header: 'Market Cap',
              accessor: 'market_cap',
              sortType: (rowA, rowB) => rowA.original.market_cap > rowB.original.market_cap ? 1 : -1,
              Cell: props => (
                <div className="flex flex-col font-semibold text-right" style={{ fontSize: '.65rem' }}>
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
                        <span className="text-gray-400 font-medium space-x-1">
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
                      <div className="skeleton w-20 h-4 rounded ml-auto" />
                      <div className="skeleton w-12 h-3.5 rounded mt-1.5 ml-auto" />
                    </>
                  }
                </div>
              ),
              headerClassName: 'justify-end text-right',
            },
          ]}
          data={coinsData && coinsData.vs_currency === vs_currency && watchlistData && watchlistData.id === coinsData.watchlist_id ? coinsData.data.map((coinData, i) => { return { ...coinData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
          defaultPageSize={10}
          pagination={!(coinsData && coinsData.data.length > 10) ? <></> : null}
          className="inline-table"
        />
      </div>}
      className={`${noBorder ? 'border-0' : ''}`}
    />
  )
}