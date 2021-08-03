import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Widget from '../widget'
import Image from '../image'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { AiOutlineFire } from 'react-icons/ai'
import _ from 'lodash'
import { coinsMarkets } from '../../lib/api/coingecko'
import { currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { numberFormat } from '../../lib/utils'

export default function Trending() {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { trending_data } = { ...data }

  const [coinsData, setCoinsData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getCoinsMarkets = async () => {
      if (trending_data) {
        const response = await coinsMarkets({ vs_currency, ids: trending_data.map(coinData => coinData.item && coinData.item.id).join(','), price_change_percentage: '24h' })

        if (mountedRef.current) {
          setCoinsData(trending_data.map(coinData => { return { ...coinData.item, vs_currency, ...(response && Array.isArray(response) ? response[response.findIndex(_coinData => _coinData.id === coinData.item.id)] : null) } }))
        }
      }
    }

    getCoinsMarkets()

    const interval = setInterval(() => getCoinsMarkets(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [vs_currency, trending_data])

  return (
    <Widget
      title={<span className="uppercase flex items-center">
        <a href="https://coingecko.com/discover" target="_blank" rel="noopener noreferrer" className="flex items-center">
          <Image src="/logos/api/coingecko.png" alt="" width={24} height={24} />
          <span className="text-gray-500 ml-2">Trending Search</span>
        </a>
        <AiOutlineFire size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
      </span>}
      description={<div className="mt-3.5">
        {coinsData ?
          _.slice(coinsData, 0, 5).map((coinData, i) => {
            const currency = currencies[currencies.findIndex(c => c.id === coinData.vs_currency)] || currencies[0]
            return (
              <div key={i} className={`${i < 3 ? `bg-yellow-${i < 1 ? 200 : i < 2 ? 100 : 50} dark:bg-indigo-${i < 1 ? 700 : i < 2 ? 800 : 900} rounded pt-1 px-1` : ''} mt-${i > 0 ? i < 3 ? 1 : 2 : 0}`}>
                <div className="flex items-center text-sm">
                  <Link href={`/coin${coinData ? `/${coinData.id}` : 's'}`}>
                    <a className="flex items-center space-x-1 mr-2">
                      <Image
                        src={coinData.large}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded"
                      />
                      <span>
                        <span className="text-gray-900 dark:text-gray-100">{coinData.name}</span>
                        <span className="uppercase text-gray-400 font-normal ml-1">{coinData.symbol}</span>
                      </span>
                    </a>
                  </Link>
                  <span className={`${coinData.price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : coinData.price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right ml-auto`}>
                    {currency.symbol}{numberFormat(coinData.current_price, '0,0.00000000')}{!currency.symbol && (<>&nbsp;{currency.id.toUpperCase()}</>)}
                  </span>
                </div>
                <div className="w-full flex items-center font-normal ml-0.5" style={{ fontSize: '.65rem' }}>
                  <div className="text-gray-600 dark:text-gray-400 mr-2">
                    <span className="text-gray-600 dark:text-gray-400 font-semibold mr-1">#{numberFormat(coinData.market_cap_rank, '0,0')}</span>
                    <span className="text-gray-500 dark:text-gray-300 font-medium mr-1">MCap:</span>{currency.symbol}{numberFormat(coinData.market_cap, '0,0.00000000')}{!currency.symbol && (<>&nbsp;{currency.id.toUpperCase()}</>)}
                  </div>
                  <div className={`flex items-center ${coinData.price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : coinData.price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} ml-auto`}>
                    {numberFormat(coinData.price_change_percentage_24h / 100, '+0,0.00%')}
                    {coinData.price_change_percentage_24h < 0 ? <FiArrowDown size={10} className="mb-0.5" /> : coinData.price_change_percentage_24h > 0 ? <FiArrowUp size={10} className="mb-0.5" /> : null}
                  </div>
                </div>
              </div>
            )
          })
          :
          [...Array(5).keys()].map(i => (
            <div key={i} className={`mt-${i > 0 ? 3 : 0}`}>
              <div className="flex items-center">
                <div className="skeleton w-5 h-5 rounded mr-1.5" />
                <div className="skeleton w-28 h-3.5 rounded" />
                <span className="ml-auto">
                  <div className="skeleton w-12 h-3.5 rounded" />
                </span>
              </div>
              <div className="flex items-center mt-1 ml-0.5">
                <div className="skeleton w-4 h-3 rounded mr-1.5" />
                <div className="skeleton w-20 h-3 rounded" />
                <span className="ml-auto">
                  <div className="skeleton w-8 h-3 rounded" />
                </span>
              </div>
            </div>
          ))
        }
      </div>}
    />
  )
}