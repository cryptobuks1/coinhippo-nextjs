import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { currencies } from '../../lib/menus'
import { numberFormat } from '../../lib/utils'

const Summary = ({ derivativesData }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query } = { ...router }
  const { derivative_type } = { ...query }

  return (
    <div className="flex flex-col sm:flex-row items-start space-y-1 sm:space-y-0 space-x-0 sm:space-x-4 mb-2 ml-0.5">
      {derivativesData && derivative_type === derivativesData.derivative_type ?
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
          <div className="skeleton w-24 h-4 rounded mr-0 sm:mr-2 mb-0.5" />
          <div className="skeleton w-48 h-4 rounded mb-0.5" />
        </>
      }
    </div>
  )
}

Summary.propTypes = {
  derivativesData: PropTypes.any,
}

export default Summary