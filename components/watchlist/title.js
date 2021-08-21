import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FiX, FiCheck, FiEdit3 } from 'react-icons/fi'
import shortid from 'shortid'
import _ from 'lodash'
import { WATCHLISTS_DATA } from '../../reducers/types'

const max_title_length = 32

export default function Title({ watchlistsData, watchlistData, onSelect, editZone, setEditZone }) {
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState((watchlistData && watchlistData.title) || '')

  useEffect(() => {
    setEditing(false)
  }, [watchlistsData, watchlistData])

  useEffect(() => {
    if (editing && editZone !== 'title') {
      setEditing(false)
    }
  }, [editZone])

  useEffect(() => {
    if (editing && setEditZone) {
      setEditZone()
    }
    else if (!editing && watchlistData && !watchlistData.id) {
      const updatedWatchlistsData = watchlistsData ? _.cloneDeep(watchlistsData).filter(_watchlistData => _watchlistData.id) : []

      localStorage.setItem(WATCHLISTS_DATA, JSON.stringify(updatedWatchlistsData))

      dispatch({
        type: WATCHLISTS_DATA,
        value: updatedWatchlistsData
      })
    }

    setTitle((watchlistData && watchlistData.title) || '')
  }, [editing])

  const id = (watchlistData && watchlistData.id) || shortid.generate()

  const update = () => {
    if (title) {
      const updatedWatchlistsData = _.cloneDeep(watchlistsData) || []
      const index = updatedWatchlistsData.findIndex(_watchlistData => !_watchlistData.id || _watchlistData.id === id)
      const updatedWatchlistData = index > -1 ? { ...updatedWatchlistsData[index], id, title } : { id, title }

      if (index > -1) {
        updatedWatchlistsData[index] = updatedWatchlistData
      }
      else {
        updatedWatchlistsData.push(updatedWatchlistData)
      }

      if (onSelect) {
        onSelect(updatedWatchlistData)
      }

      localStorage.setItem(WATCHLISTS_DATA, JSON.stringify(updatedWatchlistsData))

      dispatch({
        type: WATCHLISTS_DATA,
        value: updatedWatchlistsData
      })

      setEditing(false)
    }
  }

  return (
    <div className={`flex items-${editing ? 'start' : 'center'} space-x-1`}>
      {editing ?
        <div>
          <input
            value={title}
            onChange={event => setTitle(event.target.value.substring(0, max_title_length))}
            placeholder="Watchlist Name"
            className="w-56 h-10 bg-white dark:bg-gray-800 rounded border-0 mt-2 px-2"
          />
          <div className="text-gray-400 dark:text-gray-600 font-normal text-xs mt-1 ml-2">{title.length} / {max_title_length} characters</div>
        </div>
        :
        <span>{watchlistData ? watchlistData.title ? watchlistData.title : 'Unnamed Watchlist' : 'My First Watchlist'}</span>
      }
      {editing ?
        <span className="mt-1">
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