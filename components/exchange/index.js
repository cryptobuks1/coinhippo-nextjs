import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Summary from './summary'
import Datatable from '../../components/datatable'
import Image from '../../components/image'
import { ProgressBar } from '../../components/progress-bars'
import _ from 'lodash'
import { exchangeTickers } from '../../lib/api/coingecko'
import { currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { getName, numberFormat } from '../../lib/utils'

const per_page = 100

const Exchange = ({ exchangeData }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { all_crypto_data, exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyBTC = currencies[currencies.findIndex(c => c.id === 'btc')]

  const router = useRouter()
  const { query } = { ...router }
  const { exchange_id } = { ...query }

  const [derivativeType, setDerivativeType] = useState('perpetual')
  const [tickersData, setTickersData] = useState(null)

  const mountedRef = useMountedRef()

  const marketType = (exchangeData && exchangeData.market_type) || 'spot'

  useEffect(() => {
    const getTickers = async () => {
      let _tickersData

      for (let i = 0; i < (marketType !== 'spot' ? 1 : 20); i++) {
        const response = marketType !== 'spot' ?
          { ...exchangeData }
          :
          await exchangeTickers(exchangeData.id, { page: i + 1, order: 'trust_score_desc', depth: true })

        if (response && response.tickers) {
          _tickersData = (
            _.orderBy(
              _.concat(_tickersData || [], response.tickers)
              .map(tickerData => {
                return {
                  ...tickerData,
                  converted_last: tickerData.converted_last && Object.fromEntries(new Map(Object.entries(tickerData.converted_last).map(([key, value]) => [key, typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : -1]))),
                  h24_percentage_change: typeof tickerData.h24_percentage_change === 'string' ? Number(tickerData.h24_percentage_change) : typeof tickerData.h24_percentage_change === 'number' ? tickerData.h24_percentage_change : Number.MIN_SAFE_INTEGER,
                  index: tickerData.index === 'string' ? Number(tickerData.index) : typeof tickerData.index === 'number' ? tickerData.index : -1,
                  index_basis_percentage: tickerData.index_basis_percentage === 'string' ? Number(tickerData.index_basis_percentage) : typeof tickerData.index_basis_percentage === 'number' ? tickerData.index_basis_percentage : Number.MIN_SAFE_INTEGER,
                  bid_ask_spread_percentage: typeof tickerData.bid_ask_spread_percentage === 'string' ? Number(tickerData.bid_ask_spread_percentage) : typeof tickerData.bid_ask_spread_percentage === 'number' ? tickerData.bid_ask_spread_percentage : -1,
                  bid_ask_spread: typeof tickerData.bid_ask_spread === 'string' ? Number(tickerData.bid_ask_spread) : typeof tickerData.bid_ask_spread === 'number' ? tickerData.bid_ask_spread : -1,
                  up_depth: typeof tickerData.up_depth === 'string' ? Number(tickerData.up_depth) : typeof tickerData.up_depth === 'number' ? tickerData.up_depth : -1,
                  down_depth: typeof tickerData.down_depth === 'string' ? Number(tickerData.down_depth) : typeof tickerData.down_depth === 'number' ? tickerData.down_depth : -1,
                  funding_rate: tickerData.funding_rate === 'string' ? Number(tickerData.funding_rate) : typeof tickerData.funding_rate === 'number' ? tickerData.funding_rate : Number.MIN_SAFE_INTEGER,
                  open_interest_usd: typeof tickerData.open_interest_usd === 'string' ? Number(tickerData.open_interest_usd) : typeof tickerData.open_interest_usd === 'number' ? tickerData.open_interest_usd : -1,
                  converted_volume: tickerData.converted_volume && Object.fromEntries(new Map(Object.entries(tickerData.converted_volume).map(([key, value]) => [key, typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : -1]))),
                  trust_score: typeof tickerData.trust_score === 'number' ? tickerData.trust_score : tickerData.trust_score === 'green' ? 1 : tickerData.trust_score === 'yellow' ? 0.5 : 0,
                }
              }),
              ['trust_score'], ['desc']
            )
          )

          if (response.tickers.length < per_page) {
            break
          }
        }
      }

      if (_tickersData) {
        if (mountedRef.current) {
          if (marketType !== 'spot') {
            exchangeData.number_of_perpetual_pairs = _tickersData.filter(tickerData => tickerData.contract_type === 'perpetual').length
            exchangeData.number_of_futures_pairs = _tickersData.filter(tickerData => tickerData.contract_type === 'futures').length
          }
          else {
            exchangeData.number_of_coins = _.uniqBy(_tickersData, 'base').length
            exchangeData.number_of_pairs = _tickersData.length
          }
          setTickersData({ data: _tickersData, exchange_id: exchangeData.id })
        }
      }
    }

    if (exchangeData) {
      getTickers()
    }
  }, [exchangeData, marketType])

  return (
    <div className="mx-1">
      <Summary
        exchangeData={exchangeData && exchange_id === exchangeData.id && exchangeData}
        tickersData={tickersData && exchange_id === tickersData.exchange_id && tickersData.data && tickersData.data.filter(tickerData => marketType === 'spot' || tickerData.contract_type === derivativeType)}
        derivativeType={derivativeType}
        selectDerivativeType={derivativeType => setDerivativeType(derivativeType)}
      />
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            sortType: 'number',
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
          // {
          //   Header: coin_type === 'categories' ? 'Category' : 'Coin',
          //   accessor: 'name',
          //   Cell: props => (
          //     !props.row.original.skeleton ?
          //       <Link href={`/coin${props.row.original.id ? `${coin_type === 'categories' ? 's' : ''}/${props.row.original.id}` : 's'}`}>
          //         <a className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold" style={{ maxWidth: coin_type === 'categories' ? 'unset' : '10rem' }}>
          //           <div className="coin-column flex items-center space-x-2">
          //             {coin_type !== 'categories' && (
          //               <Image
          //                 src={props.row.original.image}
          //                 alt=""
          //                 width={24}
          //                 height={24}
          //                 className="rounded"
          //               />
          //             )}
          //             <span className="space-x-1">
          //               <span>{props.value}</span>
          //               {props.row.original.symbol && (<span className={`uppercase text-gray-400 font-normal ${props.row.original.symbol.length > 5 ? 'break-all' : ''}`}>{props.row.original.symbol}</span>)}
          //             </span>
          //           </div>
          //         </a>
          //       </Link>
          //       :
          //       <div className="flex flex-col">
          //         <div className="flex items-center">
          //           {coin_type !== 'categories' && (
          //             <div className="skeleton w-6 h-6 rounded mr-2" />
          //           )}
          //           <div className="skeleton w-24 h-4 rounded" />
          //           <div className="skeleton w-8 h-4 rounded ml-1.5" />
          //         </div>
          //       </div>
          //   ),
          // },
          // {
          //   Header: 'Price',
          //   accessor: 'current_price',
          //   sortType: (rowA, rowB) => rowA.original.current_price > rowB.original.current_price ? 1 : -1,
          //   Cell: props => (
          //     <div className="flex flex-col font-semibold text-left sm:text-right ml-0 sm:ml-auto" style={{ minWidth: '7.5rem' }}>
          //       {!props.row.original.skeleton ?
          //         <>
          //           {props.value > -1 ?
          //             <>
          //               <span className="space-x-1">
          //                 {currency.symbol}
          //                 <span>{numberFormat(props.value, '0,0.00000000')}</span>
          //                 {!(currency.symbol) && (<span className="uppercase">{currency.id}</span>)}
          //               </span>
          //               <div className="flex items-center">
          //                 <span className="text-gray-400 dark:text-gray-500 font-normal space-x-1" style={{ fontSize: '.65rem' }}>
          //                   {currency.symbol}
          //                   <span>{numberFormat(props.row.original.low_24h, '0,0.00000000')}</span>
          //                   {!(currency.symbol) && (<span className="uppercase">{currency.id}</span>)}
          //                 </span>
          //                 <span className="text-gray-400 dark:text-gray-500 font-normal space-x-1 ml-auto" style={{ fontSize: '.65rem' }}>
          //                   {currency.symbol}
          //                   <span>{numberFormat(props.row.original.high_24h, '0,0.00000000')}</span>
          //                   {!(currency.symbol) && (<span className="uppercase">{currency.id}</span>)}
          //                 </span>
          //               </div>
          //               <div className="mb-1">
          //                 <ProgressBarWithText
          //                   width={props.row.original.high_24h - props.row.original.low_24h > 0 ? (props.value - props.row.original.low_24h) * 100 / (props.row.original.high_24h - props.row.original.low_24h) : 0}
          //                   text={props.row.original.high_24h - props.row.original.low_24h > 0 && (<MdArrowDropUp size={24} className="text-gray-200 dark:text-gray-600 mt-0.5 ml-auto" style={((props.value - props.row.original.low_24h) * 100 / (props.row.original.high_24h - props.row.original.low_24h)) <= 5 ? { marginLeft: '-.5rem' } : { marginRight: '-.5rem' }} />)}
          //                   color="bg-gray-200 dark:bg-gray-600 rounded"
          //                   backgroundClassName="h-2 bg-gray-100 dark:bg-gray-800 rounded"
          //                   className="h-2"
          //                 />
          //               </div>
          //             </>
          //             :
          //             '-'
          //           }
          //         </>
          //         :
          //         <>
          //           <div className="skeleton w-20 h-4 rounded ml-0 sm:ml-auto" />
          //           <div className="flex items-center mt-2">
          //             <div className="skeleton w-8 h-3 rounded" />
          //             <div className="skeleton w-8 h-3 rounded ml-auto" />
          //           </div>
          //           <div className="skeleton w-5/6 h-2 rounded my-1" />
          //         </>
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
          // },
          // {
          //   Header: '24h',
          //   accessor: 'price_change_percentage_24h_in_currency',
          //   sortType: (rowA, rowB) => rowA.original.price_change_percentage_24h_in_currency > rowB.original.price_change_percentage_24h_in_currency ? 1 : -1,
          //   Cell: props => (
          //     <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
          //       {!props.row.original.skeleton ?
          //         props.value > Number.MIN_SAFE_INTEGER ?
          //           `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
          //           :
          //           '-'
          //         :
          //         <div className="skeleton w-10 h-3 rounded ml-auto" />
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
          // {
          //   Header: '7d',
          //   accessor: 'price_change_percentage_7d_in_currency',
          //   sortType: (rowA, rowB) => rowA.original.price_change_percentage_7d_in_currency > rowB.original.price_change_percentage_7d_in_currency ? 1 : -1,
          //   Cell: props => (
          //     <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
          //       {!props.row.original.skeleton ?
          //         props.value > Number.MIN_SAFE_INTEGER ?
          //           `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
          //           :
          //           '-'
          //         :
          //         <div className="skeleton w-10 h-3 rounded ml-auto" />
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
          // {
          //   Header: '30d',
          //   accessor: 'price_change_percentage_30d_in_currency',
          //   sortType: (rowA, rowB) => rowA.original.price_change_percentage_30d_in_currency > rowB.original.price_change_percentage_30d_in_currency ? 1 : -1,
          //   Cell: props => (
          //     <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
          //       {!props.row.original.skeleton ?
          //         props.value > Number.MIN_SAFE_INTEGER ?
          //           `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
          //           :
          //           '-'
          //         :
          //         <div className="skeleton w-10 h-3 rounded ml-auto" />
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
          // {
          //   Header: 'ROI',
          //   accessor: 'roi.times',
          //   sortType: (rowA, rowB) => (rowA.original.roi ? rowA.original.roi.times : null) > (rowB.original.roi ? rowB.original.roi.times : null) ? 1 : -1,
          //   Cell: props => (
          //     <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
          //       {!props.row.original.skeleton ?
          //         typeof props.value === 'number' ?
          //           <>
          //             <span>{numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}x</span>
          //             <div className="text-gray-400 dark:text-gray-600 font-light" style={{ fontSize: '.65rem' }}>
          //               {props.row.original.roi.from ?
          //                 <>from <span className="uppercase font-medium">{props.row.original.roi.from}</span></>
          //                 :
          //                 <>in <span className="uppercase font-medium">{props.row.original.roi.currency}</span></>
          //               }
          //             </div>
          //           </>
          //           :
          //           '-'
          //         :
          //         <div className="skeleton w-10 h-3 rounded ml-auto" />
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
          // {
          //   Header: 'Market Cap',
          //   accessor: 'market_cap',
          //   sortType: (rowA, rowB) => rowA.original.market_cap > rowB.original.market_cap ? 1 : -1,
          //   Cell: props => (
          //     <div className={`flex flex-col font-${!['high-volume'].includes(coin_type) ? 'semibold' : 'medium'} text-right mr-2`}>
          //       {!props.row.original.skeleton ?
          //         <>
          //           {props.value > -1 ?
          //             <span className="space-x-1">
          //               {currency.symbol}
          //               <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
          //               {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
          //             </span>
          //             :
          //             '-'
          //           }
          //           {exchange_rates_data && vs_currency !== currencyBTC.id && (
          //             <span className="text-gray-400 text-xs font-medium space-x-1">
          //               {props.value > -1 ?
          //                 <>
          //                   <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[vs_currency].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyBTC.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
          //                   <span className="uppercase">{currencyBTC.id}</span>
          //                 </>
          //                 :
          //                 '-'
          //               }
          //             </span>
          //           )}
          //         </>
          //         :
          //         <>
          //           <div className="skeleton w-28 h-4 rounded ml-auto" />
          //           <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
          //         </>
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right mr-2',
          // },
          // {
          //   Header: '24h',
          //   accessor: 'market_cap_change_24h',
          //   sortType: (rowA, rowB) => rowA.original.market_cap_change_24h > rowB.original.market_cap_change_24h ? 1 : -1,
          //   Cell: props => (
          //     <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium text-right mr-2`}>
          //       {!props.row.original.skeleton ?
          //         props.value > Number.MIN_SAFE_INTEGER ?
          //           `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
          //           :
          //           '-'
          //         :
          //         <div className="skeleton w-10 h-3 rounded ml-auto" />
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right mr-2',
          // },
          // {
          //   Header: (<span style={{ fontSize: '.65rem' }}>Fully Diluted MCap</span>),
          //   accessor: 'fully_diluted_valuation',
          //   sortType: (rowA, rowB) => rowA.original.fully_diluted_valuation > rowB.original.fully_diluted_valuation ? 1 : -1,
          //   Cell: props => (
          //     <div className={`flex flex-col font-${!['high-volume'].includes(coin_type) ? 'semibold' : 'medium'} text-right mr-2`}>
          //       {!props.row.original.skeleton ?
          //         <>
          //           {props.value > -1 ?
          //             <span className="space-x-1">
          //               {currency.symbol}
          //               <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
          //               {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
          //             </span>
          //             :
          //             '-'
          //           }
          //           {exchange_rates_data && vs_currency !== currencyBTC.id && (
          //             <span className="text-gray-400 text-xs font-medium space-x-1">
          //               {props.value > -1 ?
          //                 <>
          //                   <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[vs_currency].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyBTC.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
          //                   <span className="uppercase">{currencyBTC.id}</span>
          //                 </>
          //                 :
          //                 '-'
          //               }
          //             </span>
          //           )}
          //         </>
          //         :
          //         <>
          //           <div className="skeleton w-28 h-4 rounded ml-auto" />
          //           <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
          //         </>
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right mr-2',
          // },
          // {
          //   Header: '24h Volume',
          //   accessor: coin_type === 'categories' ? 'volume_24h' : 'total_volume',
          //   sortType: (rowA, rowB) => rowA.original[coin_type === 'categories' ? 'volume_24h' : 'total_volume'] > rowB.original[coin_type === 'categories' ? 'volume_24h' : 'total_volume'] ? 1 : -1,
          //   Cell: props => (
          //     <div className={`flex flex-col font-${['high-volume', 'categories'].includes(coin_type) ? 'semibold' : 'medium'} text-right mr-2`}>
          //       {!props.row.original.skeleton ?
          //         <>
          //           {props.value > -1 ?
          //             <span className="space-x-1">
          //               {currency.symbol}
          //               <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
          //               {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
          //             </span>
          //             :
          //             '-'
          //           }
          //           {exchange_rates_data && vs_currency !== currencyBTC.id && (
          //             <span className="text-gray-400 text-xs font-medium space-x-1">
          //               {props.value > -1 ?
          //                 <>
          //                   <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[vs_currency].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[vs_currency].value / exchange_rates_data[currencyBTC.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
          //                   <span className="uppercase">{currencyBTC.id}</span>
          //                 </>
          //                 :
          //                 '-'
          //               }
          //             </span>
          //           )}
          //         </>
          //         :
          //         <>
          //           <div className="skeleton w-28 h-4 rounded ml-auto" />
          //           <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
          //         </>
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right mr-2',
          // },
          // {
          //   Header: 'Market Share',
          //   accessor: 'market_share',
          //   sortType: (rowA, rowB) => rowA.original.volume_24h > rowB.original.volume_24h ? 1 : -1,
          //   Cell: props => (
          //     <div className="flex flex-col text-gray-600 dark:text-gray-400 font-normal">
          //       {!props.row.original.skeleton ?
          //         <>
          //           <span>{props.value > -1 ? `${numberFormat(props.value * 100, `0,0.000${Math.abs(props.value * 100) < 0.001 ? '000' : ''}`)}%` : '-'}</span>
          //           <ProgressBar width={props.value > -1 ? props.value * 100 : 0} color="bg-yellow-500" className="h-1" />
          //         </>
          //         :
          //         <>
          //           <div className="skeleton w-10 h-3 rounded" />
          //           <div className={`skeleton w-${Math.floor((12 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5`} />
          //         </>
          //       }
          //     </div>
          //   ),
          // },
          // {
          //   Header: (<span style={{ fontSize: '.65rem' }}>Circulating Supply</span>),
          //   accessor: 'circulating_supply',
          //   sortType: (rowA, rowB) => rowA.original.circulating_supply > rowB.original.circulating_supply ? 1 : -1,
          //   Cell: props => (
          //     <div className="flex flex-col font-medium text-right ml-auto">
          //       {!props.row.original.skeleton ?
          //         <>
          //           {props.value > -1 ?
          //             <>
          //               <span className="text-xs">
          //                 {numberFormat(props.value, '0,0')}
          //               </span>
          //               {props.row.original.max_supply && (
          //                 <>
          //                   <div className="mt-1">
          //                     <ProgressBarWithText
          //                       width={props.value * 100 / props.row.original.max_supply}
          //                       text={<div className="text-gray-600 dark:text-gray-400 font-normal mx-1" style={{ fontSize: props.value * 100 / props.row.original.max_supply < 25 ? '.45rem' : '.55rem' }}>{numberFormat(props.value * 100 / props.row.original.max_supply, `0,0.000${Math.abs(props.value * 100 / props.row.original.max_supply) < 0.001 ? '000' : ''}`)}%</div>}
          //                       color="bg-gray-200 dark:bg-gray-600 rounded"
          //                       backgroundClassName="h-3 bg-gray-100 dark:bg-gray-800 rounded"
          //                       className={`h-3 flex items-center justify-${props.value * 100 / props.row.original.max_supply < 25 ? 'start' : 'end'}`}
          //                     />
          //                   </div>
          //                   <div className="flex items-center">
          //                     <span className="text-gray-400 dark:text-gray-500 font-normal ml-auto" style={{ fontSize: '.65rem' }}>
          //                       <span className="font-medium mr-1">Max</span>
          //                       {numberFormat(props.row.original.max_supply, '0,0')}
          //                     </span>
          //                   </div>
          //                 </>
          //               )}
          //             </>
          //             :
          //             '-'
          //           }
          //         </>
          //         :
          //         <>
          //           <div className="skeleton w-20 h-3 rounded ml-auto" />
          //           <div className="skeleton w-5/6 h-3 rounded mt-2" />
          //           <div className="flex items-center mt-1">
          //             <div className="skeleton w-24 h-2.5 rounded ml-auto" />
          //           </div>
          //         </>
          //       }
          //     </div>
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
        ].filter(column => !((marketType !== 'spot' ? ['bid_ask_spread_percentage', 'up_depth', 'down_depth', 'volume_percentage', 'trust_score'] : ['h24_percentage_change', 'index', 'index_basis_percentage', 'bid_ask_spread', 'funding_rate', 'open_interest_usd']).includes(column.accessor)))}
        data={tickersData && exchange_id === tickersData.exchange_id ?
          tickersData.data.filter(tickerData => marketType === 'spot' || tickerData.contract_type === derivativeType).map((tickerData, i) => {
            const coinIndex = all_crypto_data && all_crypto_data.coins ?
              all_crypto_data.coins.findIndex(coinData => marketType !== 'spot' ?
                tickerData.base && (
                  (coinData.symbol && coinData.symbol.toLowerCase() === tickerData.base.toLowerCase()) ||
                  (coinData.id && coinData.id.toLowerCase() === tickerData.base.toLowerCase()) ||
                  (coinData.name && coinData.name.toLowerCase() === tickerData.base.toLowerCase())
                )
                :
                coinData.id === tickerData.coin_id
              )
              :
              -1

            if (coinIndex > -1) {
              tickerData.coin = { ...all_crypto_data.coins[coinIndex], image: all_crypto_data.coins[coinIndex].large }
              tickerData.coin_id = tickerData.coin_id || tickerData.coin.id
            }

            return {
              ...tickerData,
              i,
              coin_name: tickerData.coin && tickerData.coin.name ?
                tickerData.coin.name
                :
                tickerData.base && tickerData.base.startsWith('0X') && tickerData.coin_id ?
                  all_crypto_data && all_crypto_data.coins && all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.coin_id) > -1 ?
                    all_crypto_data.coins[all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.coin_id)].name
                    :
                    getName(tickerData.coin_id)
                  :
                  tickerData.base,
              pair: `
                ${tickerData.base && tickerData.base.startsWith('0X') && tickerData.coin_id ?
                  all_crypto_data && all_crypto_data.coins && all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.coin_id) > -1 ?
                    all_crypto_data.coins[all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.coin_id)].name
                    :
                    getName(tickerData.coin_id)
                  :
                  tickerData.base
                }
                /
                ${tickerData.target && tickerData.target.startsWith('0X') && tickerData.target_coin_id ?
                  all_crypto_data && all_crypto_data.coins && all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.target_coin_id) > -1 ?
                    all_crypto_data.coins[all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.target_coin_id)].name
                    :
                    getName(tickerData.target_coin_id)
                  :
                  tickerData.target
                }
              `,
              volume_percentage: data.trade_volume_24h_btc && tickersData.converted_volume && tickersData.converted_volume[currencyBTC.id] > -1 ? tickersData.converted_volume[currencyBTC.id] / data.trade_volume_24h_btc : -1,
            }
          })
          :
          [...Array(10).keys()].map(i => {return { i, skeleton: true } })
        }
        defaultPageSize={per_page}
      />
    </div>
  )
}

Exchange.propTypes = {
  exchangeData: PropTypes.any,
}

export default Exchange