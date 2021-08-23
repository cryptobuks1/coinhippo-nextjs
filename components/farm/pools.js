import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import Datatable from '../datatable'
import CopyClipboard from '../copy-clipboard'
import { ProgressBar } from '../progress-bars'
import Image from '../image'
import { FiPlus } from 'react-icons/fi'
import { MdSwapHoriz } from 'react-icons/md'
import _ from 'lodash'
import { currencies } from '../../lib/menus'
import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function Pools({ navigationItemData, poolsData, ecosystemData }) {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query } = { ...router }
  const { dex_name } = { ...query }

  return (
    <div className="my-4 mx-auto">
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            sortType: (rowA, rowB) => rowA.original.i > rowB.original.i ? 1 : -1,
            Cell: props => (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                {!props.row.original.skeleton ?
                  props.value > -1 ?
                    numberFormat(props.value + 1, '0,0')
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
            Header: 'Pair',
            accessor: 'pair',
            Cell: props => (
              !props.row.original.skeleton ?
                <>
                  <a
                    href={navigationItemData ? `${navigationItemData.dex.analytic.url}${navigationItemData.dex.analytic.pair_path.replace('{address}', props.row.original.exchange)}` : ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold"
                    style={{ minWidth: '10rem', maxWidth: '15rem' }}
                  >
                    <div className="coin-column flex items-center space-x-2">
                      <Image
                        src={props.row.original.token_0.logo_url}
                        alt=""
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                      <Image
                        src={props.row.original.token_1.logo_url}
                        alt=""
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                      <span>{props.value}</span>
                    </div>
                  </a>
                  <div className="flex items-center text-gray-400 text-xs font-normal space-x-1 ml-16">
                    <span>{ellipseAddress(props.row.original.exchange, 6)}</span>
                    <CopyClipboard text={props.row.original.exchange} size={14} />
                  </div>
                </>
                :
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="skeleton w-7 h-7 rounded-full" />
                    <div className="skeleton w-7 h-7 rounded-full mr-2" />
                    <div className="skeleton w-20 h-4 rounded" />
                  </div>
                  <div className="skeleton w-24 h-3 rounded ml-16" />
                </div>
            ),
          },
          {
            Header: 'Action',
            accessor: 'exchange',
            disableSortBy: true,
            Cell: props => (
              <div className="space-y-1">
                {!props.row.original.skeleton ?
                  <>
                    <a
                      href={navigationItemData ? props.row.original.token_0 && props.row.original.token_1 ? `${navigationItemData.dex.exchange.url}${navigationItemData.dex.exchange.liquidity_path.replace('{token_0}', props.row.original.token_0.contract_address).replace('{token_1}', props.row.original.token_1.contract_address)}` : `${navigationItemData.dex.analytic.url}${navigationItemData.dex.analytic.pair_path.replace('{address}', props.value)}` : ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-raised btn-rounded min-w-max max-w-min bg-green-500 hover:bg-green-600 flex items-center text-white hover:text-gray-50 text-xs space-x-0.5 py-1 px-1.5"
                    >
                      <FiPlus size={14} />
                      <span>Liquidity</span>
                    </a>
                    <a
                      href={navigationItemData ? props.row.original.token_0 && props.row.original.token_1 ? `${navigationItemData.dex.exchange.url}${navigationItemData.dex.exchange.swap_path.replace('{token_0}', props.row.original.token_0.contract_address).replace('{token_1}', props.row.original.token_1.contract_address)}` : `${navigationItemData.dex.analytic.url}${navigationItemData.dex.analytic.pair_path.replace('{address}', props.value)}` : ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-raised btn-rounded min-w-max max-w-min bg-indigo-500 hover:bg-indigo-600 flex items-center text-white hover:text-gray-50 text-xs space-x-0.5 py-1 px-1.5"
                    >
                      <MdSwapHoriz size={14} />
                      <span>Swap</span>
                    </a>
                  </>
                  :
                  <>
                    <div className="skeleton w-20 h-5 rounded" />
                    <div className="skeleton w-16 h-5 rounded" />
                  </>
                }
              </div>
            ),
          },
          {
            Header: 'Liquidity',
            accessor: 'total_liquidity_quote',
            sortType: (rowA, rowB) => rowA.original.total_liquidity_quote > rowB.original.total_liquidity_quote ? 1 : -1,
            Cell: props => (
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-right ml-auto">
                {!props.row.original.skeleton ?
                  props.value > -1 ?
                    <>
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      {props.value > 0 && ecosystemData && ecosystemData.liquidity_chart_7d && _.last(ecosystemData.liquidity_chart_7d) && _.last(ecosystemData.liquidity_chart_7d).liquidity_quote && (
                        <ProgressBar width={props.value * 100 / _.last(ecosystemData.liquidity_chart_7d).liquidity_quote} color="bg-yellow-500" className="h-1 mt-1 ml-0 sm:ml-auto" />
                      )}
                    </>
                    :
                    '-'
                  :
                  <>
                    <div className="skeleton w-20 h-4 rounded ml-auto" />
                    <div className={`skeleton w-${Math.floor((12 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5 ml-auto`} />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Volume 24h',
            accessor: 'volume_24h_quote',
            sortType: (rowA, rowB) => rowA.original.volume_24h_quote > rowB.original.volume_24h_quote ? 1 : -1,
            Cell: props => (
              <div className="text-gray-600 dark:text-gray-400 font-normal text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > -1 ?
                    <>
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      {props.value > 0 && ecosystemData && ecosystemData.volume_chart_7d && _.last(ecosystemData.volume_chart_7d) && _.last(ecosystemData.volume_chart_7d).volume_quote && (
                        <ProgressBar width={props.value * 100 / _.last(ecosystemData.volume_chart_7d).volume_quote} color="bg-yellow-500" className="h-1 mt-1 ml-auto" />
                      )}
                    </>
                    :
                    '-'
                  :
                  <>
                    <div className="skeleton w-20 h-4 rounded ml-auto" />
                    <div className={`skeleton w-${Math.floor((12 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5 ml-auto`} />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Base Reserve',
            accessor: 'token_0.reserve',
            sortType: (rowA, rowB) => Number(rowA.original.token_0.reserve) * Math.pow(10, -rowA.original.token_0.contract_decimals) > Number(rowB.original.token_0.reserve) * Math.pow(10, -rowB.original.token_0.contract_decimals) ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <>
                  <a
                    href={navigationItemData ? `${navigationItemData.dex.analytic.url}${navigationItemData.dex.analytic.token_path.replace('{address}', props.row.original.token_0.contract_address)}` : ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col whitespace-pre-wrap text-gray-600 dark:text-gray-400"
                    style={{ minWidth: '10rem', maxWidth: '15rem' }}
                  >
                    <div className="coin-column flex items-center space-x-2">
                      <Image
                        src={props.row.original.token_0.logo_url}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="space-x-1">
                        <span>{!isNaN(props.value) ? numberFormat(Number(props.value) * Math.pow(10, -props.row.original.token_0.contract_decimals), '0,0') : '-'}</span>
                        {props.row.original.token_0.contract_ticker_symbol && (<span className={`uppercase text-blue-600 dark:text-blue-400 font-semibold ${props.row.original.token_0.contract_ticker_symbol.length > 6 ? 'break-all' : ''}`}>{props.row.original.token_0.contract_ticker_symbol}</span>)}
                      </span>
                    </div>
                  </a>
                  <div className="flex items-center text-gray-400 text-xs font-normal space-x-1 ml-8">
                    <span>{ellipseAddress(props.row.original.token_0.contract_address, 6)}</span>
                    <CopyClipboard text={props.row.original.token_0.contract_address} size={14} />
                  </div>
                </>
                :
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="skeleton w-6 h-6 rounded-full mr-2" />
                    <div className="skeleton w-20 h-4 rounded" />
                    <div className="skeleton w-8 h-4 rounded ml-1.5" />
                  </div>
                  <div className="skeleton w-24 h-3 rounded ml-8" />
                </div>
            ),
          },
          {
            Header: 'Quote Reserve',
            accessor: 'token_1.reserve',
            sortType: (rowA, rowB) => Number(rowA.original.token_1.reserve) * Math.pow(10, -rowA.original.token_1.contract_decimals) > Number(rowB.original.token_1.reserve) * Math.pow(10, -rowB.original.token_1.contract_decimals) ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <>
                  <a
                    href={navigationItemData ? `${navigationItemData.dex.analytic.url}${navigationItemData.dex.analytic.token_path.replace('{address}', props.row.original.token_1.contract_address)}` : ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col whitespace-pre-wrap text-gray-600 dark:text-gray-400"
                    style={{ minWidth: '10rem', maxWidth: '15rem' }}
                  >
                    <div className="coin-column flex items-center space-x-2">
                      <Image
                        src={props.row.original.token_1.logo_url}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="space-x-1">
                        <span>{!isNaN(props.value) ? numberFormat(Number(props.value) * Math.pow(10, -props.row.original.token_1.contract_decimals), '0,0') : '-'}</span>
                        {props.row.original.token_1.contract_ticker_symbol && (<span className={`uppercase text-blue-600 dark:text-blue-400 font-semibold ${props.row.original.token_1.contract_ticker_symbol.length > 6 ? 'break-all' : ''}`}>{props.row.original.token_1.contract_ticker_symbol}</span>)}
                      </span>
                    </div>
                  </a>
                  <div className="flex items-center text-gray-400 text-xs font-normal space-x-1 ml-8">
                    <span>{ellipseAddress(props.row.original.token_1.contract_address, 6)}</span>
                    <CopyClipboard text={props.row.original.token_1.contract_address} size={14} />
                  </div>
                </>
                :
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="skeleton w-6 h-6 rounded-full mr-2" />
                    <div className="skeleton w-20 h-4 rounded" />
                    <div className="skeleton w-8 h-4 rounded ml-1.5" />
                  </div>
                  <div className="skeleton w-24 h-3 rounded ml-8" />
                </div>
            ),
          },
          {
            Header: 'Fees 24h',
            accessor: 'fee_24h_quote',
            sortType: (rowA, rowB) => rowA.original.fee_24h_quote > rowB.original.fee_24h_quote ? 1 : -1,
            Cell: props => (
              <div className="text-gray-600 dark:text-gray-400 font-normal text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > -1 ?
                    <>
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      {props.value > 0 && ecosystemData && ecosystemData.total_fees_24h && (
                        <ProgressBar width={props.value * 100 / ecosystemData.total_fees_24h} color="bg-yellow-500" className="h-1 mt-1 ml-auto" />
                      )}
                    </>
                    :
                    '-'
                  :
                  <>
                    <div className="skeleton w-20 h-4 rounded ml-auto" />
                    <div className={`skeleton w-${Math.floor((12 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5 ml-auto`} />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: '%Fees (Yearly)',
            accessor: 'annualized_fee',
            sortType: (rowA, rowB) => rowA.original.annualized_fee > rowB.original.annualized_fee ? 1 : -1,
            Cell: props => (
              <div className="text-gray-600 dark:text-gray-400 font-semibold text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > -1 ?
                    <span className="text-green-500 dark:text-green-400">{numberFormat(props.value * 100, `0,0.000${Math.abs(props.value * 100) < 0.001 ? '000' : ''}`)}%</span>
                    :
                    '-'
                  :
                  <div className="skeleton w-12 h-4 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
        ]}
        data={poolsData ? poolsData.map((poolData, i) => { return { ...poolData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
        defaultPageSize={10}
        pagination={(!poolsData || poolsData.length <= 10) && (<></>)}
      />
    </div>
  )
}