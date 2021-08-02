import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import Widget from '../widget'
import { ProgressBar } from '../progress-bars'
import { AiOutlinePieChart } from 'react-icons/ai'
import { BiPieChartAlt } from 'react-icons/bi'
import _ from 'lodash'
import { numberFormat } from '../../lib/utils'

export default function Dominance() {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { global_data, all_crypto_data } = { ...data }

  return (
    <Widget
      title={<span className="uppercase flex items-center">
        Dominance
        <AiOutlinePieChart size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
      </span>}
      description={<div className="mt-3.5">
        {global_data && all_crypto_data ?
          [...Array(1).keys()].map(index => {
            const dominancesData = _.slice(_.orderBy(Object.keys(global_data.market_cap_percentage).map(symbol => {
              return {
                symbol,
                color: symbol === 'bnb' ? 'bg-yellow-400' : symbol === 'usdt' ? 'bg-green-500' : undefined,
                dominance: global_data.market_cap_percentage[symbol],
                ...(all_crypto_data.coins[all_crypto_data.coins.findIndex((coinData, i) => i < 25 && coinData.symbol && coinData.symbol.toLowerCase() === symbol)])
              }
            }), ['dominance'], ['desc']), 0, 5)

            dominancesData.push({ name: 'Others', dominance: 100 - _.sumBy(dominancesData, 'dominance') })

            return dominancesData.map((coinData, i) => (
              <div key={i} className={`mt-${i > 0 ? 2 : 0}`}>
                <div className="flex items-center">
                  <Link href={`/coin${coinData ? `/${coinData.id}` : 's'}`}>
                    <a className="flex items-center">
                      {!coinData.large && coinData.name === 'Others' ?
                        <BiPieChartAlt size={24} className="stroke-current text-gray-400 mr-2" />
                        :
                        <img
                          src={coinData.large}
                          alt=""
                          className="w-6 h-6 rounded mr-2"
                        />
                      }
                      <span className="text-gray-900 dark:text-gray-100">{coinData.name}</span>
                      <span className="text-gray-400 font-normal ml-1.5">{coinData.symbol}</span>
                    </a>
                  </Link>
                  <span className="text-gray-500 dark:text-gray-300 text-xs font-normal ml-auto">
                    {numberFormat(coinData.dominance / 100, '0,0.00%')}
                  </span>
                </div>
                <div className="mt-1">
                  <ProgressBar width={coinData.dominance} color={`${coinData.color || ['bg-yellow-500', 'bg-blue-400', 'bg-green-500', 'bg-yellow-400', 'bg-indigo-500'][i % 5]} rounded`} />
                </div>
              </div>
            ))
          })
          :
          [...Array(6).keys()].map(i => (
            <div key={i} className={`mt-${i > 0 ? 2 : 0}`}>
              <div className="flex items-center">
                <div className="skeleton w-6 h-6 rounded mr-2.5" />
                <div className="skeleton w-16 h-3 rounded" />
                <span className="ml-auto">
                  <div className="skeleton w-8 h-3.5 rounded" />
                </span>
              </div>
              <div className={`skeleton w-${5 - i || 3}/12 h-1 rounded mt-1`} />
            </div>
          ))
        }
      </div>}
    />
  )
}