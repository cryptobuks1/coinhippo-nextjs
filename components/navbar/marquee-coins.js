import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import PageVisibility from 'react-page-visibility'
import Ticker from 'react-ticker'
import { currencies } from '../../lib/menus'
import { numberFormat } from '../../lib/utils'

const MarqueeCoins = ({ data }) => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { vs_currency } = { ...preferences }

  const [pageVisible, setPageVisible] = useState(true)
  const [currentCurrency, setCurrentCurrency] = useState(vs_currency)

  const handleVisibilityChange = visible => setPageVisible(visible)

  useEffect(() => {
    setCurrentCurrency(currentCurrency && currentCurrency !== vs_currency ? null : vs_currency)
  }, [vs_currency, currentCurrency])

  return data && currentCurrency === vs_currency && (
    <PageVisibility onChange={handleVisibilityChange}>
      {pageVisible && (
        <Ticker>
          {({ index }) => (
            <>
              {[data[index % data.length]].map(item => {
                const currency = currencies[currencies.findIndex(c => c.id === item.vs_currency)] || currencies[0]
                return (
                  <Link key={index} href={`/coin${item.id ? `/${item.id}` : 's'}`}>
                    <a>
                      <div className={`h-5 w-full flex items-center text-xs font-semibold mt-0.5 px-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'md:px-3'}`}>
                        <div className="flex items-center mr-2">
                          <img
                            src={item.image}
                            alt=""
                            className="w-4 h-4 rounded mr-1"
                          />
                          <span>{item.symbol && item.symbol.toUpperCase()}{item.vs_currency !== vs_currency && (<span className="font-light">{item.vs_currency.toUpperCase()}</span>)}</span>
                        </div>
                        <div className={`${item.price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : item.price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium ml-auto`}>
                          {currency.symbol}{numberFormat(item.current_price, '0,0.00000000')}{!currency.symbol && (<>&nbsp;{currency.id.toUpperCase()}</>)}
                        </div>
                      </div>
                      <div className={`w-full flex items-center font-normal ml-0.5 px-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'md:px-3'}`} style={{ fontSize: '.65rem' }}>
                        <div className="text-gray-500 dark:text-gray-400 mr-2"><span className="text-gray-600 dark:text-gray-400 font-semibold mr-1">#{numberFormat(item.market_cap_rank, '0,0')}</span>{item.name}</div>
                        <div className={`flex items-center ${item.price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : item.price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} ml-auto`}>
                          {numberFormat(item.price_change_percentage_24h / 100, '+0,0.00%')}
                          {item.price_change_percentage_24h < 0 ? <FiArrowDown size={10} className="mb-0.5" /> : item.price_change_percentage_24h > 0 ? <FiArrowUp size={10} className="mb-0.5" /> : null}
                        </div>
                      </div>
                    </a>
                  </Link>
                )
              })}
            </>
          )}
        </Ticker>
      )}
    </PageVisibility>
  )
}

MarqueeCoins.propTypes = {
  data: PropTypes.any,
}

export default MarqueeCoins