import { useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import AllCrypto from './all-crypto'
import { FiSearch } from 'react-icons/fi'
import _ from 'lodash'
import { ALL_CRYPTO_DATA } from '../../reducers/types'

export default function Search({ initialCoinIds }) {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { all_crypto_data } = { ...data }

  const [hidden, setHidden] = useState(true)
  const [inputSearch, setInputSearch] = useState('')
  const [coinIds, setCoinIds] = useState(initialCoinIds || [])

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        hidden ||
        buttonRef.current.contains(event.target) ||
        dropdownRef.current.contains(event.target)
      ) {
        return false
      }
      setHidden(!hidden)
      setInputSearch('')
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const handleDropdownClick = () => {
    if (hidden) {
      setHidden(!hidden)
    }
  }

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
    }
  }

  return (
    <div className="navbar-search w-full max-w-xs mr-2">
      <div className="relative">
        <input
          ref={buttonRef}
          value={inputSearch}
          onClick={handleDropdownClick}
          onChange={event => {
            setInputSearch(event.target.value)
            if (hidden) {
              setHidden(false)
            }
          }}
          type="search"
          placeholder="Search..."
          className="w-full h-10 appearance-none rounded-full text-sm pl-10 pr-5 focus:outline-none"
        />
        <div className="absolute top-0 left-0 mt-3 ml-4">
          <FiSearch className="w-4 h-4 stroke-current" />
        </div>
        <div
          ref={dropdownRef} 
          className={`dropdown ${hidden ? '' : 'open'} absolute top-0 left-0 md:left-8 mt-12`}
        >
          <div className="dropdown-content w-64 bottom-start">
            <AllCrypto data={all_crypto_data} inputSearch={inputSearch} handleSelect={coinId => handleSelect(coinId)} />
          </div>
        </div>
      </div>
    </div>
  )
}