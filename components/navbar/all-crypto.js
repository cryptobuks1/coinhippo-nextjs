import Link from 'next/link'
import PropTypes from 'prop-types'
import _ from 'lodash'

const AllCrypto = ({ data, trendingData, inputSearch, handleDropdownClick }) => {
  let allCryptoData = { ...data }

  if (allCryptoData) {
    Object.keys(allCryptoData).forEach(genre => {
      allCryptoData[genre] = allCryptoData[genre] && _.orderBy(allCryptoData[genre].filter(item => inputSearch && item).map(item => {
        return { ...item, scores: ['symbol', 'name'].map(field => item[field] && item[field].toLowerCase().includes(inputSearch.toLowerCase()) ? inputSearch.length > 1 ? (item.market_cap_rank < 50) * inputSearch.length / item[field].length : .5 : -1) }
      }).filter(item => _.max(item.scores) > 3 / 10), ['scores'], ['desc']).filter((item, i) => i < 100)

      if (!(allCryptoData[genre] && allCryptoData[genre].length > 0)) {
        delete allCryptoData[genre]
      }
    })
  }

  if (!(allCryptoData && Object.keys(allCryptoData).findIndex(genre => allCryptoData[genre] && allCryptoData[genre].length > 0) > -1)) {
    if (trendingData && trendingData.coins && trendingData.coins.length > 0) {
      allCryptoData = {
        '🔥 trending': trendingData.coins.map(item => item.item)
      }
    }
  }

  return (
    <div className="max-h-80 overflow-y-scroll">
      {allCryptoData && Object.keys(allCryptoData).map((genre, i) => (
        <div key={i}>
          <div className="dropdown-title">{genre}</div>
          {allCryptoData[genre].map((item, j) => (
            <Link
              key={j}
              href={`/${genre === 'exchanges' ? 'exchange' : genre === 'categories' ? 'coins' : 'coin'}/${genre === 'categories' && item.category_id ? item.category_id : item.id}`}
              onClick={() => handleDropdownClick()}
            >
              <a className="dropdown-item w-full flex items-center justify-start text-sm space-x-2 p-2">
                {item.large && (
                  <img
                    src={item.large}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="w-full flex items-center text-xs">
                  <span className="font-semibold">
                    {item.name}
                    {item.symbol && (<span className="uppercase text-gray-400 font-light ml-1">{item.symbol}</span>)}
                  </span>
                  <span className="uppercase text-gray-400 font-semibold ml-auto">{typeof item.market_cap_rank === 'number' ? `#${item.market_cap_rank}` : item.market_type}</span>
                </span>
              </a>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

AllCrypto.propTypes = {
  data: PropTypes.any,
  trendingData: PropTypes.any,
  inputSearch: PropTypes.string,
  handleDropdownClick: PropTypes.any,
}

export default AllCrypto