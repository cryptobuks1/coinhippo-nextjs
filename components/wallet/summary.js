import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Image from '../image'
import _ from 'lodash'
import { currencies } from '../../lib/menus'
import { numberFormat } from '../../lib/utils'

const Summary = ({ balancesData, contractData }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query } = { ...router }
  const { asset } = { ...query }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 space-x-0 sm:space-x-4 mb-2 ml-0.5">
      {contractData && (
        <div className="coin-column flex items-center space-x-2">
          <Image
            src={contractData.logo_url}
            useMocked={Math.floor(Math.random() * 10)}
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="space-x-1">
            <span className="font-semibold">{contractData.contract_name}</span>
            {contractData.contract_ticker_symbol && (<span className={`uppercase text-gray-400 font-normal ${contractData.contract_ticker_symbol.length > 6 ? 'break-all' : ''}`}>{contractData.contract_ticker_symbol}</span>)}
            {contractData.prices.findIndex(priceData => typeof priceData.price === 'number') > -1 && [contractData.prices[contractData.prices.findIndex(priceData => typeof priceData.price === 'number')]].map((priceData, i) => (
              <span key={i} className="text-gray-700 dark:text-gray-300 font-medium space-x-1">
                {(exchange_rates_data ? currency : currencyUSD).symbol}
                <span>{numberFormat(priceData.price * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
              </span>
            ))}
          </span>
        </div>
      )}
      {balancesData ?
        <>
          <span className="flex items-center space-x-1">
            <span className="text-gray-400 dark:text-gray-600 font-normal">{asset === 'nft' ? 'NFT' : 'Token'}s:</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{numberFormat(balancesData.length, '0,0')}</span>
          </span>
          {!(['nft'].includes(asset)) && (
            <span className="flex flex-wrap items-center justify-start sm:justify-end space-x-1">
              <span className="text-gray-400 dark:text-gray-600 font-normal">Balances:</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium space-x-1">
                {(exchange_rates_data ? currency : currencyUSD).symbol}
                <span>{numberFormat(_.sumBy(balancesData.filter(balanceData => balanceData.quote > 0), 'quote') * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
              </span>
            </span>
          )}
        </>
        :
        <>
          <div className="skeleton w-24 h-4 rounded mr-0 sm:mr-2" />
          {!(['nft'].includes(asset)) && (
            <div className="skeleton w-48 h-4 rounded" />
          )}
        </>
      }
    </div>
  )
}

Summary.propTypes = {
  balancesData: PropTypes.any,
}

export default Summary