import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import AllCrypto from './all-crypto'
import { FiSearch } from 'react-icons/fi'
import { allCrypto, allCategories, trendingSearch } from '../../lib/api/coingecko'
import { ALL_CRYPTO_DATA, TRENDING_DATA } from '../../reducers/types'

export default function Search() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { all_crypto_data, trending_data } = { ...data }

  const [hidden, setHidden] = useState(true)
  const [inputSearch, setInputSearch] = useState('')

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
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const handleDropdownClick = () => setHidden(!hidden)

  useEffect(() => {
    const getAllCrypto = async () => {
      const response = await allCrypto()

      if (response) {
        if (response.categories && response.categories.length > 0) {
          const responseCategories = await allCategories()

          if (responseCategories && responseCategories.length > 0) {
            response.categories.forEach((category, i) => {
              const categoryIndex = responseCategories.findIndex(_category => _category.name === category.name)
              if (categoryIndex > -1) {
                category.category_id = responseCategories[categoryIndex].category_id
              }
              response.categories[i] = category
            })
          }

          response.categories = response.categories.filter(category => category.category_id)
        }

        dispatch({
          type: ALL_CRYPTO_DATA,
          value: response
        })
      }
    }

    getAllCrypto()
  }, [])

  useEffect(() => {
    const getTrendingSearch = async () => {
      const response = await trendingSearch()

      if (response) {
        dispatch({
          type: TRENDING_DATA,
          value: response.coins
        })
      }
    }

    getTrendingSearch()

    const interval = setInterval(() => getTrendingSearch(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="navbar-search w-full max-w-xs mr-2">
      <div className="relative">
        <input
          ref={buttonRef}
          onClick={handleDropdownClick}
          onChange={event => {
            setInputSearch(event.target.value)
            if (hidden) {
              setHidden(false)
            }
          }}
          type="search"
          placeholder={hidden ? 'Search...' : 'What are you looking for?'}
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
            <AllCrypto data={all_crypto_data} trendingData={trending_data} inputSearch={inputSearch} handleDropdownClick={handleDropdownClick} />
          </div>
        </div>
      </div>
    </div>
  )
}