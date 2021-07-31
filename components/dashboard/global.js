import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import Widget from '../widget'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { BiCoinStack } from 'react-icons/bi'
import { AiOutlineShop, AiOutlineStock, AiOutlineBarChart } from 'react-icons/ai'
import { currencies } from '../../lib/menus'
import { numberFormat } from '../../lib/utils'

export default function Global() {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { global_data, all_crypto_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <Link href="/coins">
        <a>
          <Widget
            title={<span className="uppercase">Cryptos</span>}
            description={<span className="text-lg lg:text-base xl:text-lg">
              {global_data ?
                numberFormat(global_data.active_cryptocurrencies, '0,0')
                :
                <div className="bg-gray-50 dark:bg-gray-800 animate-pulse w-16 h-6 rounded mt-1" />
              }
            </span>}
            right={<BiCoinStack size={32} className="stroke-current text-gray-300 dark:text-gray-500" />}
          />
        </a>
      </Link>
      <Link href="/exchanges">
        <a>
          <Widget
            title={<span className="uppercase">Exchanges</span>}
            description={<span className="text-lg lg:text-base xl:text-lg">
              {all_crypto_data ?
                numberFormat(all_crypto_data.exchanges && all_crypto_data.exchanges.length, '0,0')
                :
                <div className="bg-gray-50 dark:bg-gray-800 animate-pulse w-16 h-6 rounded mt-1" />
              }
            </span>}
            right={<AiOutlineShop size={32} className="stroke-current text-gray-300 dark:text-gray-500" />}
          />
        </a>
      </Link>
      <Link href="/coins">
        <a>
          <Widget
            title={<div className="flex items-center uppercase">
              Market Cap
              {global_data && (
                <div className={`flex items-center ${global_data.market_cap_change_percentage_24h_usd < 0 ? 'text-red-500 dark:text-red-400' : global_data.market_cap_change_percentage_24h_usd > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium ml-1`}>
                  {numberFormat(global_data.market_cap_change_percentage_24h_usd / 100, '+0,0.00%')}
                  {global_data.market_cap_change_percentage_24h_usd < 0 ? <FiArrowDown size={14} className="mb-0.5" /> : global_data.market_cap_change_percentage_24h_usd > 0 ? <FiArrowUp size={14} className="mb-0.5" /> : null}
                </div>
              )}
            </div>}
            description={<span className="text-lg lg:text-base xl:text-lg">
              {global_data ?
                <>
                  {currency.symbol}
                  {numberFormat(global_data.total_market_cap && global_data.total_market_cap[vs_currency], '0,0')}
                  {!currency.symbol && <>&nbsp;{currency.id.toUpperCase()}</>}
                </>
                :
                <div className="bg-gray-50 dark:bg-gray-800 animate-pulse w-36 h-6 rounded mt-1" />
              }
            </span>}
            right={<AiOutlineStock size={32} className="stroke-current text-gray-300 dark:text-gray-500" />}
          />
        </a>
      </Link>
      <Link href="/coins/high-volume">
        <a>
          <Widget
            title={<span className="uppercase">24h Volume</span>}
            description={<span className="text-lg lg:text-base xl:text-lg">
              {global_data ?
                <>
                  {currency.symbol}
                  {numberFormat(global_data.total_volume && global_data.total_volume[vs_currency], '0,0')}
                  {!currency.symbol && <>&nbsp;{currency.id.toUpperCase()}</>}
                </>
                :
                <div className="bg-gray-50 dark:bg-gray-800 animate-pulse w-36 h-6 rounded mt-1" />
              }
            </span>}
            right={<AiOutlineBarChart size={32} className="stroke-current text-gray-300 dark:text-gray-500" />}
          />
        </a>
      </Link>
    </div>
  )
}