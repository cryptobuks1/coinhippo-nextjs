import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import Widget from '../widget'
import { ProgressBar } from '../progress-bars'
import { FiPieChart } from 'react-icons/fi'
import _ from 'lodash'
import { numberFormat } from '../../lib/utils'

export default function Dominance() {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { global_data, all_crypto_data } = { ...data }

  return (
    <Widget
      title={<span className="uppercase flex items-center">
        Dominance
        <FiPieChart size={32} className="stroke-current text-gray-300 dark:text-gray-500 ml-auto" />
      </span>}
      description={<div className="mt-2.5 mb-1">
        {global_data && all_crypto_data ?
          _.slice(_.orderBy(Object.keys(global_data.market_cap_percentage).map(symbol => {
            return {
              symbol,
              color: symbol === 'bnb' ? 'bg-yellow-400' : symbol === 'usdt' ? 'bg-green-500' : undefined,
              dominance: global_data.market_cap_percentage[symbol],
              ...(all_crypto_data.coins[all_crypto_data.coins.findIndex((coinData, i) => i < 25 && coinData.symbol && coinData.symbol.toLowerCase() === symbol)])
            }
          }), ['dominance'], ['desc']), 0, 5).map((coinData, i) => (
            <div key={i} className="my-1.5">
              <div className="flex items-center">
                <Link href={`/coin${coinData ? `/${coinData.id}` : 's'}`}>
                  <a className="flex items-center">
                    <img
                      src={coinData.large}
                      alt=""
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-gray-900 dark:text-gray-100">{coinData.name}</span>
                    <span className="text-gray-400 font-normal ml-1.5">{coinData.symbol}</span>
                  </a>
                </Link>
                <span className="text-gray-500 dark:text-gray-300 text-xs font-normal ml-auto">
                  {numberFormat(coinData.dominance / 100, '0,0.00%')}
                </span>
              </div>
              <div className="mt-1.5">
                <ProgressBar width={coinData.dominance} color={`${coinData.color || ['bg-yellow-500', 'bg-blue-400', 'bg-green-500', 'bg-yellow-400', 'bg-indigo-500'][i % 5]} rounded`} />
              </div>
            </div>
          ))
          :
          [...Array(5).keys()].map(i => (
            <div key={i} className="my-1.5">
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-800 animate-pulse w-6 h-6 rounded-full mr-2.5" />
                <div className="bg-gray-100 dark:bg-gray-800 animate-pulse w-1/4 h-3 rounded" />
                <span className="ml-auto">
                  <div className="bg-gray-100 dark:bg-gray-800 animate-pulse w-8 h-3.5 rounded" />
                </span>
              </div>
              <div className={`bg-gray-100 dark:bg-gray-800 animate-pulse w-${6 - i}/12 h-1 rounded mt-1.5`} />
            </div>
          ))
        }
      </div>}
    />
  )
}