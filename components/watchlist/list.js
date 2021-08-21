import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Modal from '../modals/modal-confirm'
import { FiX } from 'react-icons/fi'
import _ from 'lodash'
import { WATCHLISTS_DATA } from '../../reducers/types'

export default function List({ watchlistsData, watchlistData, onSelect, editZone, setEditZone }) {
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setEditing(false)
  }, [watchlistsData, watchlistData])

  useEffect(() => {
    if (editing && editZone !== 'list') {
      setEditing(false)
    }
  }, [editZone])

  useEffect(() => {
    if (editing && setEditZone) {
      setEditZone()
    }
  }, [editing])

  const create = () => {
    const updatedWatchlistsData = _.cloneDeep(watchlistsData) || []
    if (!_.last(updatedWatchlistsData) || _.last(updatedWatchlistsData).id) {
      updatedWatchlistsData.push({ title: '' })
    }

    dispatch({
      type: WATCHLISTS_DATA,
      value: updatedWatchlistsData
    })

    setEditing(false)
  }

  const remove = id => {
    let updatedWatchlistsData = _.cloneDeep(watchlistsData) || []
    const index = updatedWatchlistsData.findIndex(_watchlistData => _watchlistData.id === id)

    updatedWatchlistsData = updatedWatchlistsData.filter((_watchlistData, i) => index > -1 ? i !== index : _watchlistData.id)

    localStorage.setItem(WATCHLISTS_DATA, JSON.stringify(updatedWatchlistsData))

    dispatch({
      type: WATCHLISTS_DATA,
      value: updatedWatchlistsData
    })

    setEditing(false)
  }

  return (
    <div className="ml-0 sm:ml-4 pr-1">
      {watchlistsData && watchlistsData.length > 0 && (
        <div className="flex items-center sm:justify-end space-x-2 mt-2 sm:mt-0">
          {editing ?
            <button
              onClick={() => setEditing(false)}
              className="btn btn-flat btn-rounded bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300 text-xs p-2"
            >
              Cancel Editing
            </button>
            :
            <>
              <button
                onClick={() => create()}
                className="btn btn-flat btn-rounded bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300 text-xs p-2"
              >
                Create Watchlist
              </button>
              <button
                onClick={() => setEditing(true)}
                className="btn btn-flat btn-rounded bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300 text-xs p-2"
              >
                Manage Watchlist
              </button>
            </>
          }
        </div>
      )}
      {watchlistsData && onSelect && (
        <div className="flex flex-wrap items-center sm:justify-end">
          {watchlistsData.map((item, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => onSelect(item)}
                className={`btn btn-raised min-w-max btn-rounded flex items-center ${!item.id || watchlistData && item.id === watchlistData.id ? 'bg-indigo-600 text-white' : 'bg-transparent hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:text-white dark:hover:text-gray-200'} text-xs space-x-1.5 my-1 ${i < watchlistsData.length - 1 ? 'mr-2 md:mr-3' : ''} p-2`}
              >
                <span className={`normal-case ${!item.id ? 'italic' : ''}`}>{item.title || '[New Watchlist]'}</span>
              </button>
              {editing && (
                <Modal
                  buttonTitle={<FiX className="stroke-current" />}
                  buttonClassName="btn btn-flat btn-circle-sm btn-circle bg-transparent hover:bg-red-100 dark:hover:bg-red-900 text-red-500 hover:text-red-600 dark:text-red-100 dark:hover:text-red-200"
                  title="Remove Watchlist"
                  icon={<span className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-500 dark:text-white text-lg font-bold">
                    <FiX size={18} className="stroke-current" />
                  </span>}
                  body="Do you want to delete your watchlist? Performing this action you understand that you would not be able to recover this watchlist."
                  confirmButtonTitle="Remove"
                  onConfirm={() => remove(item.id)}
                  confirmButtonClassName="btn btn-default btn-rounded bg-red-500 hover:bg-red-600 text-white"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}