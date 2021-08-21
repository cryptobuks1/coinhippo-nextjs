import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import AllCoin from './all-coin'
import { FiSearch } from 'react-icons/fi'
import _ from 'lodash'
import { ALL_CRYPTO_DATA } from '../../reducers/types'

export default function Search({ initialCoinIds, updateCoinIds }) {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { all_crypto_data } = { ...data }

  const [inputSearch, setInputSearch] = useState('')
  const [coinIds, setCoinIds] = useState(initialCoinIds || [])

  useEffect(() => {
    setCoinIds(initialCoinIds || [])
  }, [initialCoinIds])

  const handleSelect = coinId => {
    if (coinId) {
      let _coinIds = _.cloneDeep(coinIds)

      if (_coinIds.includes(coinId)) {
        _coinIds = _coinIds.filter(_coinId => _coinId !== coinId)
      }
      else {
        _coinIds.push(coinId)
      }

      setCoinIds(_coinIds)
      if (updateCoinIds) {
        updateCoinIds(_coinIds)
      }
    }
  }

  return (
    <div className="navbar-search w-full mr-2" style={{ minWidth: '30rem' }}>
      <div className="relative">
        <input
          value={inputSearch}
          onChange={event => setInputSearch(event.target.value)}
          type="search"
          placeholder="Search..."
          className="w-full h-10 bg-transparent appearance-none rounded-full text-sm pl-10 pr-5 focus:outline-none"
        />
        <div className="absolute top-0 left-0 mt-3 ml-4">
          <FiSearch className="w-4 h-4 stroke-current" />
        </div>
        <div className="w-full mx-auto py-2">
          <AllCoin data={all_crypto_data && all_crypto_data.coins} coinIds={coinIds} inputSearch={inputSearch} handleSelect={coinId => handleSelect(coinId)} />
        </div>
      </div>
    </div>
  )
}