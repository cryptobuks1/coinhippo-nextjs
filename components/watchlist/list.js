import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Modal from '../modals/modal-confirm'
import { FiX } from 'react-icons/fi'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import _ from 'lodash'
import { WATCHLISTS_DATA } from '../../reducers/types'

export default function List({ watchlistsData, watchlistData, onSelect, editZone, setEditZone }) {
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (editing && editZone !== 'list') {
      setEditing(false)
    }
  }, [editZone])

  useEffect(() => {
    if (setEditZone) {
      if (editing && editZone !== 'list') {
        setEditZone()
      }
      else if (!editing && editZone) {
        setEditZone('')
      }
    }
  }, [editing])

  const create = () => {
    const updatedWatchlistsData = _.cloneDeep(watchlistsData) || []
    if (updatedWatchlistsData.findIndex(_watchlistData => !_watchlistData.id) < 0) {
      updatedWatchlistsData.push({ title: '' })
    }

    if (onSelect) {
      onSelect(updatedWatchlistsData[updatedWatchlistsData.findIndex(_watchlistData => !_watchlistData.id)])
    }

    dispatch({
      type: WATCHLISTS_DATA,
      value: updatedWatchlistsData,
      noSave: true
    })
  }

  const remove = id => {
    let updatedWatchlistsData = _.cloneDeep(watchlistsData) || []
    const index = updatedWatchlistsData.findIndex(_watchlistData => _watchlistData.id === id)

    updatedWatchlistsData = updatedWatchlistsData.filter((_watchlistData, i) => index > -1 ? i !== index : _watchlistData.id)

    dispatch({
      type: WATCHLISTS_DATA,
      value: updatedWatchlistsData
    })

    setEditing(false)
  }

  const move = (from, to) => {
    const updatedWatchlistsData = _.cloneDeep(watchlistsData) || []

    const fromData = updatedWatchlistsData[from]
    const toData = updatedWatchlistsData[to]

    updatedWatchlistsData[from] = toData
    updatedWatchlistsData[to] = fromData    

    dispatch({
      type: WATCHLISTS_DATA,
      value: updatedWatchlistsData
    })
  }

  return (
    <div className="ml-0 sm:ml-4 pr-1">
      {watchlistsData && watchlistsData.length > 0 && (
        <div className="flex items-center sm:justify-end space-x-1 mt-2 sm:mt-0">
          {editing ?
            <button
              onClick={() => setEditing(false)}
              className="btn btn-flat btn-rounded bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300 text-xs p-2"
            >
              Exit Editing
            </button>
            :
            editZone !== 'title' ?
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
                  Manage
                </button>
              </>
              :
              null
          }
        </div>
      )}
      {watchlistsData && onSelect && (
        <div className="flex flex-wrap items-center sm:justify-end">
          {watchlistsData.map((item, i) => (
            <div key={i} className={`flex items-center ${i < watchlistsData.length - 1 ? 'mr-2 md:mr-3' : ''}`}>
              {editing && (
                <div className="flex flex-col">
                  <div className="h-6" />
                  {i > 0 ?
                    <button
                      onClick={() => move(i, i - 1)}
                      className="btn btn-flat btn-circle-sm btn-circle bg-transparent hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500 hover:text-blue-600 dark:text-blue-100 dark:hover:text-blue-200 mb-5"
                    >
                      <BsArrowLeft className="stroke-current" />
                    </button>
                    :
                    <div className="h-6 mb-5" />
                  }
                </div>
              )}
              <button
                onClick={() => onSelect(item)}
                className={`btn btn-raised min-w-max btn-rounded flex items-center ${!item.id || watchlistData && item.id === watchlistData.id ? 'bg-indigo-600 text-white' : 'bg-transparent hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:text-white dark:hover:text-gray-200'} text-xs space-x-1.5 my-1 p-2`}
              >
                <span className={`normal-case ${!item.id ? 'italic' : ''}`}>{item.title || '[New Watchlist]'}</span>
              </button>
              {editing && (
                <div className="flex flex-col">
                  <Modal
                    buttonTitle={<FiX className="stroke-current" />}
                    buttonClassName="btn btn-flat btn-circle-sm btn-circle bg-transparent hover:bg-red-100 dark:hover:bg-red-900 text-red-500 hover:text-red-600 dark:text-red-100 dark:hover:text-red-200"
                    title="Remove Watchlist"
                    icon={<span className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-500 dark:text-white text-lg font-bold">
                      <FiX size={18} className="stroke-current" />
                    </span>}
                    body={<span>Do you want to delete {item.title ? <span className="font-semibold">{item.title}</span> : 'this watchlist'}? Performing this action you understand that you would not be able to recover this watchlist.</span>}
                    confirmButtonTitle="Remove"
                    onConfirm={() => remove(item.id)}
                    confirmButtonClassName="btn btn-default btn-rounded bg-red-500 hover:bg-red-600 text-white"
                  />
                  {i < watchlistsData.length - 1 ?
                    <button
                      onClick={() => move(i, i + 1)}
                      className="btn btn-flat btn-circle-sm btn-circle bg-transparent hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500 hover:text-blue-600 dark:text-blue-100 dark:hover:text-blue-200 mb-5"
                    >
                      <BsArrowRight className="stroke-current" />
                    </button>
                    :
                    <div className="h-6 mb-5" />
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}