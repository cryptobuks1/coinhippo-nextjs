import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Image from '../image'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import PageVisibility from 'react-page-visibility'
import Ticker from 'react-ticker'
import { currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { numberFormat } from '../../lib/utils'

const MarqueeCoins = ({ data }) => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { vs_currency } = { ...preferences }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const [pageVisible, setPageVisible] = useState(true)
  const [currentCurrency, setCurrentCurrency] = useState(vs_currency)

  const mountedRef = useMountedRef()

  const handleVisibilityChange = visible => setPageVisible(visible)

  useEffect(() => {
    if (mountedRef.current) {
      setCurrentCurrency(currentCurrency && currentCurrency !== vs_currency ? null : vs_currency)
    }
  }, [vs_currency, currentCurrency])

  const isWidget = ['price-marquee'].includes(widget)

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
                    <a target={isWidget ? '_blank' : '_self'} rel={isWidget ? 'noopener noreferrer' : ''}>
                      <div className={`h-5 w-full flex items-center text-xs font-semibold mt-0.5 px-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'md:px-3'}`}>
                        <div className="flex items-center space-x-1 mr-2">
                          <Image
                            src={item.image}
                            alt=""
                            width={16}
                            height={16}
                            className="rounded"
                          />
                          <span className="uppercase">{item.symbol}{item.vs_currency !== vs_currency && (<span className="font-light">{item.vs_currency}</span>)}</span>
                        </div>
                        <div className={`${item.price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : item.price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium space-x-1 ml-auto`}>
                          {currency.symbol}
                          <span>{numberFormat(item.current_price, '0,0.00000000')}</span>
                          {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
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