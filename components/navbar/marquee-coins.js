import Link from 'next/link'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import PageVisibility from 'react-page-visibility'
import Ticker from 'react-ticker'
import { numberFormat } from '../../lib/utils'

const MarqueeCoins = ({ data }) => {
  const [pageVisible, setPageVisible] = useState(true)

  const handleVisibilityChange = visible => setPageVisible(visible)

  return data && (
    <PageVisibility onChange={handleVisibilityChange}>
      {pageVisible && (
        <Ticker>
          {({ index }) => (
            <>
              {[data[index % data.length]].map(item => (
                <Link key={index} href={`/coin${item.id ? `/${item.id}` : 's'}`}>
                  <a>
                    <div className={`w-full flex items-center text-xs font-semibold px-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'md:px-3'}`}>
                      <div className="flex items-center mr-2">
                        <img
                          src={item.image}
                          alt=""
                          className="w-4 h-4 rounded-full mr-1"
                        />
                        <span>{item.symbol && item.symbol.toUpperCase()}</span>
                      </div>
                      <div className={`text-${item.price_change_percentage_24h < 0 ? 'red' : item.price_change_percentage_24h > 0 ? 'green' : 'gray'}-500 font-medium ml-auto`}>
                        ${numberFormat(item.current_price, '0,0.00000000')}
                      </div>
                    </div>
                    <div className={`w-full flex items-center font-normal mt-0.5 ml-0.5 px-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'md:px-3'}`} style={{ fontSize: '.65rem' }}>
                      <div className="text-gray-500 dark:text-gray-400 mr-2"><span className="text-gray-600 dark:text-gray-400 font-semibold mr-1">#{numberFormat(item.market_cap_rank, '0,0')}</span>{item.name}</div>
                      <div className={`flex items-center text-${item.price_change_percentage_24h < 0 ? 'red' : item.price_change_percentage_24h > 0 ? 'green' : 'gray'}-500 ml-auto`}>
                        {numberFormat(item.price_change_percentage_24h / 100, '+0,0.00%')}
                        {item.price_change_percentage_24h < 0 ? <FiArrowDown size={10} className="mb-0.5" /> : item.price_change_percentage_24h > 0 ? <FiArrowUp size={10} className="mb-0.5" /> : null}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
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