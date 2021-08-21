import PropTypes from 'prop-types'
import Image from '../image'
import { HiCheckCircle } from 'react-icons/hi'
import _ from 'lodash'

const AllCoin = ({ data, coinIds, inputSearch, handleSelect }) => {
  let allCoinData = _.cloneDeep(data)

  if (allCoinData) {
    allCoinData = _.orderBy(allCoinData.filter(item => inputSearch && item).map(item => {
      return { ...item, scores: ['symbol', 'name', 'id'].map(field => item[field] && item[field].toLowerCase().includes(inputSearch.toLowerCase()) ? inputSearch.length > 1 ? (typeof item.market_cap_rank === 'number' ? item.market_cap_rank <= 10 ? 10 : item.market_cap_rank <= 20 ? 4 : item.market_cap_rank <= 50 ? 2 : 1 : 1) * (inputSearch.length / item[field].length) : .5 : -1) }
    }).map(item => { return { ...item, max_score: _.max(item.scores) } }).filter(item => item.max_score > 3 / 10), ['max_score', 'market_cap_rank'], ['desc', 'asc']).filter((item, i) => i < 100)
  }

  if (!(allCoinData && allCoinData.length > 0)) {
    if (data) {
      allCoinData = data.filter((coinData, i) => i < 100)
    }
  }

  return (
    <div className="max-h-80 overflow-y-scroll">
      {allCoinData && allCoinData.map((item, i) => (
        <div
          onClick={() => handleSelect(item.id)}
          className="dropdown-item w-full rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-start text-sm space-x-2 p-2"
        >
          {item.large && (
            <Image
              src={item.large}
              alt=""
              width={24}
              height={24}
              className="rounded"
            />
          )}
          <span className="w-full flex items-center text-xs">
            <span className="font-semibold">
              {item.name}
              {item.symbol && (<span className="uppercase text-gray-400 font-normal ml-1">{item.symbol}</span>)}
            </span>
            <span className="ml-auto">
              {coinIds && coinIds.includes(item.id) && (
                <HiCheckCircle size={16} className="text-indigo-600" />
              )}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

AllCoin.propTypes = {
  data: PropTypes.any,
  coinIds: PropTypes.any,
  inputSearch: PropTypes.string,
  handleSelect: PropTypes.any,
}

export default AllCoin