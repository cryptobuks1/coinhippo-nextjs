import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import Summary from './summary'
import Datatable from '../datatable'
import CopyClipboard from '../copy-clipboard'
import { ProgressBar } from '../progress-bars'
import Image from '../image'
import { currencies } from '../../lib/menus'
import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function Assets({ balancesData, contractData }) {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query } = { ...router }
  const { chain_name } = { ...query }

  return (
    <>
      <Summary balancesData={balancesData} contractData={contractData} />
      <div className="max-w-2xl my-4 mx-auto">
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
              Header: 'Token',
              accessor: 'contract_name',
              Cell: props => (
                !props.row.original.skeleton ?
                  <>
                    <Link href={`/wallet/${chain_name}/${props.row.original.contract_address}`}>
                      <a className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold" style={{ minWidth: '10rem', maxWidth: '15rem' }}>
                        <div className="coin-column flex items-center space-x-2">
                          <Image
                            src={props.row.original.logo_url}
                            useMocked={props.row.original.i}
                            alt=""
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          <span className="space-x-1">
                            <span>{props.value}</span>
                            {props.row.original.contract_ticker_symbol && (<span className={`uppercase text-gray-400 font-normal ${props.row.original.contract_ticker_symbol.length > 6 ? 'break-all' : ''}`}>{props.row.original.contract_ticker_symbol}</span>)}
                          </span>
                        </div>
                      </a>
                    </Link>
                    {props.row.original.contract_address && (
                      <div className="flex items-center text-gray-400 text-xs font-normal space-x-1 ml-9">
                        <span>{ellipseAddress(props.row.original.contract_address, 6)}</span>
                        <CopyClipboard text={props.row.original.contract_address} size={14} />
                      </div>
                    )}
                  </>
                  :
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <div className="skeleton w-7 h-7 rounded-full mr-2" />
                      <div className="skeleton w-24 h-4 rounded" />
                      <div className="skeleton w-8 h-4 rounded ml-1.5" />
                    </div>
                    <div className="skeleton w-24 h-3 rounded ml-9" />
                  </div>
              ),
            },
            {
              Header: 'Balance',
              accessor: 'balance',
              sortType: (rowA, rowB) => rowA.original.balance * Math.pow(10, -rowA.original.contract_decimals) > rowB.original.balance * Math.pow(10, -rowB.original.contract_decimals) ? 1 : -1,
              Cell: props => (
                <div className="font-medium text-left sm:text-right ml-0 sm:ml-auto">
                  {!props.row.original.skeleton ?
                    props.value > -1 ?
                      <span className="space-x-1">
                        <span>{numberFormat(props.value * Math.pow(10, -props.row.original.contract_decimals), '0,0.00000000')}</span>
                        {props.row.original.contract_ticker_symbol && (<span className={`uppercase text-gray-400 font-normal ${props.row.original.contract_ticker_symbol.length > 6 ? 'break-all' : ''}`}>{props.row.original.contract_ticker_symbol}</span>)}
                      </span>
                      :
                      '-'
                    :
                    <div className="skeleton w-20 h-4 rounded ml-0 sm:ml-auto" />
                  }
                </div>
              ),
              headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
            },
            {
              Header: 'Price',
              accessor: 'quote_rate',
              sortType: (rowA, rowB) => rowA.original.quote_rate > rowB.original.quote_rate ? 1 : -1,
              Cell: props => (
                <div className="text-gray-600 dark:text-gray-400 font-medium text-right mr-2">
                  {!props.row.original.skeleton ?
                    props.value > -1 ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    :
                    <div className="skeleton w-20 h-4 rounded ml-auto" />
                  }
                </div>
              ),
              headerClassName: 'justify-end text-right mr-2',
            },
            {
              Header: 'Value',
              accessor: 'quote',
              sortType: (rowA, rowB) => rowA.original.quote > rowB.original.quote ? 1 : -1,
              Cell: props => (
                <div className="font-semibold text-right mr-2">
                  {!props.row.original.skeleton ?
                    props.value > -1 && props.row.original.quote_rate > -1 ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    :
                    <div className="skeleton w-24 h-4 rounded ml-auto" />
                  }
                </div>
              ),
              headerClassName: 'justify-end text-right mr-2',
            },
            {
              Header: 'Proportion',
              accessor: 'port_share',
              sortType: (rowA, rowB) => rowA.original.quote > rowB.original.quote ? 1 : -1,
              Cell: props => (
                <div className="flex flex-col text-gray-600 dark:text-gray-400 font-normal">
                  {!props.row.original.skeleton ?
                    <>
                      <span>{props.value > -1 ? `${numberFormat(props.value * 100, `0,0.000${Math.abs(props.value * 100) < 0.001 ? '000' : ''}`)}%` : '-'}</span>
                      {props.value > 0 && (
                        <ProgressBar width={props.value > -1 ? props.value * 100 : 0} color="bg-yellow-500" className="h-1" />
                      )}
                    </>
                    :
                    <>
                      <div className="skeleton w-10 h-3 rounded" />
                      <div className={`skeleton w-${Math.floor((12 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5`} />
                    </>
                  }
                </div>
              ),
            }
          ]}
          data={balancesData ? balancesData.map((balanceData, i) => { return { ...balanceData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
          defaultPageSize={10}
          pagination={(!balancesData || balancesData.length <= 10) && (<></>)}
        />
      </div>
    </>
  )
}