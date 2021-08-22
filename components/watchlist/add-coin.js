import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Tooltip from '../tooltip'
import { FaStar, FaRegStar } from 'react-icons/fa'
import _ from 'lodash'
import { WATCHLISTS_DATA } from '../../reducers/types'

export default function AddCoinToWatchlist({ coinId }) {
  const dispatch = useDispatch()
  const { watchlist } = useSelector(state => ({ watchlist: state.watchlist }), shallowEqual)
  const { watchlists_data } = { ...watchlist }

  const [hidden, setHidden] = useState(true)

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

  const update = watchlistId => {
    if (coinId && watchlistId) {
      const updatedWatchlistsData = _.cloneDeep(watchlists_data) || []
      const index = updatedWatchlistsData.findIndex(_watchlistData => _watchlistData.id === watchlistId)
      const updatedWatchlistData = index > -1 && { ...updatedWatchlistsData[index] }

      if (index > -1) {
        let coinIds = updatedWatchlistData.coin_ids || []
        if (coinIds.includes(coinId)) {
          coinIds = coinIds.filter(_coinId => _coinId !== coinId)
        }
        else {
          coinIds.push(coinId)
        }

        updatedWatchlistData.coin_ids = coinIds

        updatedWatchlistsData[index] = updatedWatchlistData

        dispatch({
          type: WATCHLISTS_DATA,
          value: updatedWatchlistsData,
          saveId: watchlistId
        })
      }
    }
  }

  const watched = coinId && watchlists_data && watchlists_data.findIndex(_watchlistData => _watchlistData.coin_ids && _watchlistData.coin_ids.includes(coinId)) > -1

  const numWatchList = watched ? watchlists_data.filter(_watchlistData => _watchlistData.coin_ids && _watchlistData.coin_ids.includes(coinId)).length : 0

  return coinId && watchlists_data && watchlists_data.length > 0 && (
    <Tooltip
      placement="top"
      content={<span className="whitespace-nowrap text-gray-700 dark:text-gray-300 text-xs">
        {!watched ? 'Add to Watchlist' : numWatchList === watchlists_data.length ? 'Remove from Watchlist' : 'Update Watchlist'}
      </span>}
    >
      {watchlists_data.length === 1 ?
        <button
          onClick={() => update(watchlists_data[0].id)}
          className="btn btn-flat btn-circle bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-400"
        >
          {watched ? <FaStar size={16} className="stroke-current" /> : <FaRegStar size={16} className="stroke-current" />}
        </button>
        :
        <div className="relative">
		      <button
		        ref={buttonRef}
		        onClick={handleDropdownClick}
		        className="btn btn-flat btn-circle bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-400"
        	>
		        {watched ? <FaStar size={16} className="stroke-current" /> : <FaRegStar size={16} className="stroke-current" />}
		      </button>
		      <div
		        ref={dropdownRef} 
		        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 left-0 mt-8`}
		      >
		        <div className="dropdown-content w-56 bottom-start">
		          <div className="dropdown-title text-left">Watchlist</div>
				      <div className="flex flex-wrap pb-1">
				        {watchlists_data.map((item, i) => (
				          <button
				            key={i}
				            onClick={() => update(item.id)}
				            className="dropdown-item w-full flex items-center justify-start py-2 px-3"
				          >
				            <span className="break-all text-gray-500 dark:text-gray-300 text-xs font-medium text-left">{item.title}</span>
				            <span className="text-yellow-500 hover:text-yellow-400 ml-auto">
				            	{item.coin_ids && item.coin_ids.includes(coinId) ?
				            		<FaStar size={14} className="stroke-current" />
				            		:
				            		<FaRegStar size={14} className="stroke-current" />
				            	}
				            </span>
				          </button>
				        ))}
				      </div>
		        </div>
		      </div>
		    </div>
      }
    </Tooltip>
  )
}