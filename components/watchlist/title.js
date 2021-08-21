import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FiX, FiCheck, FiEdit3 } from 'react-icons/fi'
import shortid from 'shortid'
import { WATCHLISTS_DATA } from '../../reducers/types'

export default function Title({ watchlistsData, watchlistData }) {
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState((watchlistData && watchlistData.title) || '')

  useEffect(() => {
    setEditing(false)
  }, [watchlistsData, watchlistData])

  useEffect(() => {
  	if (!editing) {
  		setTitle((watchlistData && watchlistData.title) || '')
  	}
  }, [editing])

  const id = (watchlistData && watchlistData.id) || shortid.generate()

  const update = () => {
    if (title) {
    	const updatedWatchlistsData = watchlistsData || []
      const index = updatedWatchlistsData.findIndex(_watchlistData => _watchlistData.id === id)
      const updatedWatchlistData = index > -1 ? updatedWatchlistsData[index] : { id }

      updatedWatchlistData.title = title

      if (index > -1) {
        updatedWatchlistsData[index] = updatedWatchlistData
      }
      else {
        updatedWatchlistsData.push(updatedWatchlistData)
      }

      localStorage.setItem(WATCHLISTS_DATA, JSON.stringify(updatedWatchlistsData))

      dispatch({
        type: WATCHLISTS_DATA,
        value: updatedWatchlistsData
      })
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {editing ?
      	<input
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Watchlist Name"
          className="w-56 h-10 bg-white dark:bg-gray-800 rounded border-0 px-2"
        />
      	:
      	<span>{watchlistData ? watchlistData.title ? watchlistData.title : 'Unnamed Watchlist' : 'My First Watchlist'}</span>
      }
      {editing ?
        <span>
          <button
            onClick={() => setEditing(false)}
            className="btn btn-flat btn-circle-lg btn-circle bg-transparent hover:bg-red-100 dark:hover:bg-red-900 text-red-500 hover:text-red-600 dark:text-red-100 dark:hover:text-red-200"
          >
            <FiX className="stroke-current" />
          </button>
          <button
            onClick={() => update()}
            className="btn btn-flat btn-circle-lg btn-circle bg-transparent hover:bg-green-100 dark:hover:bg-green-900 text-green-500 hover:text-green-600 dark:text-green-100 dark:hover:text-green-200"
          >
            <FiCheck className="stroke-current" />
          </button>
        </span>
        :
        <button
          onClick={() => setEditing(true)}
          className="btn btn-flat btn-circle-lg btn-circle bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900 text-indigo-500 hover:text-indigo-600 dark:text-indigo-100 dark:hover:text-indigo-200"
        >
          <FiEdit3 size={20} className="stroke-current" />
        </button>
      }
    </div>
  )
}