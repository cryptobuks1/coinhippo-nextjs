import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Widget from '../widget'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaBitcoin } from 'react-icons/fa'
import { GiCoins, GiChargingBull, GiBearHead, GiCamel } from 'react-icons/gi'
import { BiTransferAlt } from 'react-icons/bi'
import { AiOutlineStock, AiOutlineBarChart } from 'react-icons/ai'
import parse from 'html-react-parser'
import { currencies } from '../../lib/menus'
import { numberFormat } from '../../lib/utils'

const Global = ({ bitcoin, marketStatus }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { global_data, all_crypto_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]

  return (
    <div className="w-full grid grid-flow-row grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-2 xl:gap-2 mb-4 lg:mb-2 xl:mb-4">
      <Link href="/coin/bitcoin">
        <a>
          <Widget
            title={<span className="uppercase text-yellow-500 dark:text-gray-100 font-semibold text-xs">Bitcoin</span>}
            description={<span className="text-base md:text-sm">
              {bitcoin && currency.id in bitcoin ?
                <div className={`h-5 flex items-center ${bitcoin[`${currency.id}_24h_change`] < 0 ? 'text-red-500 dark:text-red-400' : bitcoin[`${currency.id}_24h_change`] > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-bold`}>
                  <span className="space-x-1 mr-1.5">
                    {currency.symbol}
                    <span>{numberFormat(bitcoin[vs_currency], '0,0')}</span>
                    {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                  </span>
                  <span className="text-xs font-normal">{numberFormat(bitcoin[`${currency.id}_24h_change`], '+0,0.000')}%</span>
                  {bitcoin[`${currency.id}_24h_change`] < 0 ? <FiArrowDown size={12} className="ml-0.5 mb-0.5" /> : bitcoin[`${currency.id}_24h_change`] > 0 ? <FiArrowUp size={12} className="ml-0.5 mb-0.5" /> : null}
                </div>
                :
                <div className="skeleton w-12 h-4 rounded mt-1" />
              }
            </span>}
            right={<FaBitcoin size={24} className="hidden sm:block stroke-current text-yellow-500" />}
            className="bg-gradient-to-r from-gray-100 to-gray-100 dark:from-gray-800 dark:to-gray-800 p-3 lg:p-2 xl:p-3"
          />
        </a>
      </Link>
      <Widget className="w-full grid grid-flow-row grid-cols-2 p-0">
        <Link href="/coins">
          <a>
            <Widget
              title={<span className="uppercase text-gray-500 dark:text-gray-300 text-xs">Cryptos</span>}
              description={<span className="text-gray-900 dark:text-white text-sm xs:text-base md:text-xs">
                {global_data ?
                  numberFormat(global_data.active_cryptocurrencies, '0,0')
                  :
                  <div className="skeleton w-10 h-4 rounded mt-1" />
                }
              </span>}
              right={<GiCoins size={24} className="hidden sm:block stroke-current text-gray-500 dark:text-gray-400" />}
              className="bg-transparent border-0 py-3 px-2 lg:p-2 xl:p-3"
            />
          </a>
        </Link>
        <Link href="/exchanges">
          <a>
            <Widget
              title={<span className="uppercase text-gray-500 dark:text-gray-300 text-xs">Exchanges</span>}
              description={<span className="text-gray-900 dark:text-white text-sm xs:text-base md:text-xs">
                {all_crypto_data ?
                  numberFormat(all_crypto_data.exchanges && all_crypto_data.exchanges.length, '0,0')
                  :
                  <div className="skeleton w-10 h-4 rounded mt-1" />
                }
              </span>}
              right={<BiTransferAlt size={24} className="hidden sm:block stroke-current text-gray-500 dark:text-gray-400" />}
              className="bg-transparent border-0 py-3 pl-0 pr-2 lg:p-2 xl:p-3"
            />
          </a>
        </Link>
      </Widget>
      <Link href="/coins">
        <a>
          <Widget
            title={<div className="h-5 flex items-center uppercase whitespace-nowrap text-gray-500 dark:text-gray-300 text-xs">
              Market Cap
              {global_data && (
                <div className={`flex items-center ${global_data.market_cap_change_percentage_24h_usd < 0 ? 'text-red-500 dark:text-red-400' : global_data.market_cap_change_percentage_24h_usd > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium ml-1`}>
                  {numberFormat(global_data.market_cap_change_percentage_24h_usd, '+0,0.000')}%
                  {global_data.market_cap_change_percentage_24h_usd < 0 ? <FiArrowDown size={12} className="mb-0.5" /> : global_data.market_cap_change_percentage_24h_usd > 0 ? <FiArrowUp size={12} className="mb-0.5" /> : null}
                </div>
              )}
            </div>}
            description={<span className="text-sm sm:text-base md:text-xs space-x-1">
              {global_data ?
                <>
                  {currency.symbol}
                  <span>{numberFormat(global_data.total_market_cap && global_data.total_market_cap[vs_currency], '0,0')}</span>
                  {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                </>
                :
                <div className="skeleton w-16 h-4 rounded mt-1" />
              }
            </span>}
            right={<AiOutlineStock size={24} className="hidden sm:block stroke-current text-gray-500 dark:text-gray-400" />}
            className="p-3 lg:p-2 xl:p-3"
          />
        </a>
      </Link>
      <Link href="/coins/high-volume">
        <a>
          <Widget
            title={<span className="uppercase text-gray-500 dark:text-gray-300 text-xs">24h Volume</span>}
            description={<span className="text-sm sm:text-base md:text-xs space-x-1">
              {global_data ?
                <>
                  {currency.symbol}
                  <span>{numberFormat(global_data.total_volume && global_data.total_volume[vs_currency], '0,0')}</span>
                  {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                </>
                :
                <div className="skeleton w-16 h-4 rounded mt-1" />
              }
            </span>}
            right={<AiOutlineBarChart size={24} className="hidden sm:block stroke-current text-gray-500 dark:text-gray-400" />}
            className="p-3 lg:p-2 xl:p-3"
          />
        </a>
      </Link>
      <Widget
        title={<span className={`uppercase ${marketStatus && marketStatus.status ? 'text-white' : 'text-gray-500 dark:text-gray-300'} text-xs`}>Market Status</span>}
        description={<span className={`${marketStatus && marketStatus.status ? 'text-white' : ''} text-sm sm:text-base md:text-xs space-x-1`}>
          {marketStatus ?
            parse(marketStatus.html)
            :
            <div className="skeleton w-20 h-4 rounded mt-1" />
          }
        </span>}
        right={marketStatus && marketStatus.status ?
          marketStatus.status.includes('bull') ?
            <GiChargingBull size={36} className="stroke-current text-white" style={{ transform: 'scaleX(-1)' }} /> :
          marketStatus.status.includes('bear') ?
            <GiBearHead size={36} className="stroke-current text-white" style={{ transform: 'scaleX(-1)' }} /> :
            <GiCamel size={36} className="stroke-current text-white" style={{ transform: 'scaleX(-1)' }} />
          :
          <div className="skeleton w-9 h-6 rounded" />
        }
        className={`${marketStatus && marketStatus.status ?
          marketStatus.status === 'bear' ?
            'bg-red-700 dark:bg-red-800' :
          marketStatus.status === 'bear_starting' ?
            'bg-red-500 dark:bg-red-600' :
          marketStatus.status === 'likely_bear' ?
            'bg-red-300 dark:bg-red-400' :
          marketStatus.status === 'likely_bull' ?
            'bg-indigo-300 dark:bg-indigo-400' :
          marketStatus.status === 'bull_starting' ?
            'bg-indigo-500 dark:bg-indigo-600' :
          marketStatus.status === 'bull' ?
            'bg-indigo-700 dark:bg-indigo-800' :
            'bg-gray-300 dark:bg-gray-700'
          :
          ''
        } p-3 lg:p-2 xl:p-3`}
      />
    </div>
  )
}

Global.propTypes = {
  bitcoin: PropTypes.any,
}

export default Global