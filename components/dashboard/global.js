import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Widget from '../widget'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaBitcoin } from 'react-icons/fa'
import { GiCoins } from 'react-icons/gi'
import { RiExchangeBoxLine } from 'react-icons/ri'
import { AiOutlineStock, AiOutlineBarChart } from 'react-icons/ai'
import { currencies } from '../../lib/menus'
import { numberFormat } from '../../lib/utils'

const Global = ({ bitcoin }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { global_data, all_crypto_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-2 xl:gap-4 mb-4 lg:mb-2 xl:mb-4">
      <Link href="/coin/bitcoin">
        <a>
          <Widget
            title={<span className="uppercase text-xs">Bitcoin</span>}
            description={<span className="text-base md:text-xs">
              {bitcoin ?
                <div className={`h-5 flex items-center ${bitcoin.usd_24h_change < 0 ? 'text-red-500 dark:text-red-400' : bitcoin.usd_24h_change > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-bold`}>
                  <span className="mr-1.5">{currency.symbol}{numberFormat(bitcoin[vs_currency], '0,0')}{!currency.symbol && (<>&nbsp;{currency.id.toUpperCase()}</>)}</span>
                  <span className="font-normal">{numberFormat(bitcoin.usd_24h_change / 100, '+0,0.00%')}</span>
                  {bitcoin.usd_24h_change < 0 ? <FiArrowDown size={10} className="mb-0.5" /> : bitcoin.usd_24h_change > 0 ? <FiArrowUp size={10} className="mb-0.5" /> : null}
                </div>
                :
                <div className="skeleton w-12 h-4 rounded mt-1" />
              }
            </span>}
            right={<FaBitcoin size={24} className="stroke-current text-yellow-500" />}
            className="p-3 lg:p-2 xl:p-3"
          />
        </a>
      </Link>
      <Link href="/coins">
        <a>
          <Widget
            title={<span className="uppercase text-xs">Cryptos</span>}
            description={<span className="text-base md:text-xs">
              {global_data ?
                numberFormat(global_data.active_cryptocurrencies, '0,0')
                :
                <div className="skeleton w-10 h-4 rounded mt-1" />
              }
            </span>}
            right={<GiCoins size={24} className="stroke-current text-gray-500 dark:text-gray-400" />}
            className="p-3 lg:p-2 xl:p-3"
          />
        </a>
      </Link>
      <Link href="/exchanges">
        <a>
          <Widget
            title={<span className="uppercase text-xs">Exchanges</span>}
            description={<span className="text-base md:text-xs">
              {all_crypto_data ?
                numberFormat(all_crypto_data.exchanges && all_crypto_data.exchanges.length, '0,0')
                :
                <div className="skeleton w-10 h-4 rounded mt-1" />
              }
            </span>}
            right={<RiExchangeBoxLine size={24} className="stroke-current text-gray-500 dark:text-gray-400" />}
            className="p-3 lg:p-2 xl:p-3"
          />
        </a>
      </Link>
      <Link href="/coins">
        <a>
          <Widget
            title={<div className="h-5 flex items-center uppercase text-xs">
              Market Cap
              {global_data && (
                <div className={`flex items-center ${global_data.market_cap_change_percentage_24h_usd < 0 ? 'text-red-500 dark:text-red-400' : global_data.market_cap_change_percentage_24h_usd > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium ml-1`}>
                  {numberFormat(global_data.market_cap_change_percentage_24h_usd / 100, '+0,0.00%')}
                  {global_data.market_cap_change_percentage_24h_usd < 0 ? <FiArrowDown size={12} className="mb-0.5" /> : global_data.market_cap_change_percentage_24h_usd > 0 ? <FiArrowUp size={12} className="mb-0.5" /> : null}
                </div>
              )}
            </div>}
            description={<span className="text-base md:text-xs">
              {global_data ?
                <>
                  {currency.symbol}
                  {numberFormat(global_data.total_market_cap && global_data.total_market_cap[vs_currency], '0,0')}
                  {!currency.symbol && (<>&nbsp;{currency.id.toUpperCase()}</>)}
                </>
                :
                <div className="skeleton w-16 h-4 rounded mt-1" />
              }
            </span>}
            right={<AiOutlineStock size={24} className="stroke-current text-gray-500 dark:text-gray-400" />}
            className="p-3 lg:p-2 xl:p-3"
          />
        </a>
      </Link>
      <Link href="/coins/high-volume">
        <a>
          <Widget
            title={<span className="uppercase text-xs">24h Volume</span>}
            description={<span className="text-base md:text-xs">
              {global_data ?
                <>
                  {currency.symbol}
                  {numberFormat(global_data.total_volume && global_data.total_volume[vs_currency], '0,0')}
                  {!currency.symbol && (<>&nbsp;{currency.id.toUpperCase()}</>)}
                </>
                :
                <div className="skeleton w-16 h-4 rounded mt-1" />
              }
            </span>}
            right={<AiOutlineBarChart size={24} className="stroke-current text-gray-500 dark:text-gray-400" />}
            className="p-3 lg:p-2 xl:p-3"
          />
        </a>
      </Link>
    </div>
  )
}

Global.propTypes = {
  bitcoin: PropTypes.any,
}

export default Global