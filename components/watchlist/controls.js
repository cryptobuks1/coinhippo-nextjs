import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Search from './search'
import Modal from '../modals/modal-confirm-default'
import Popover from '../popover'
import CopyClipboard from '../copy-clipboard'
import { Badge } from '../badges'
import { FiShare2, FiPlusCircle } from 'react-icons/fi'
import _ from 'lodash'
import { getName } from '../../lib/utils'
import { WATCHLISTS_DATA } from '../../reducers/types'

export default function Controls({ watchlistsData, watchlistData, addOnly }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { all_crypto_data, trending_data } = { ...data }

  const router = useRouter()
  const { query, pathname } = { ...router }
  const { watchlist_id } = { ...query }

  const [coinIds, setCoinIds] = useState((watchlistData && watchlistData.coin_ids) || [])

  useEffect(() => {
    setCoinIds((watchlistData && watchlistData.coin_ids) || [])
  }, [watchlistsData, watchlistData])

  const update = () => {
    const updatedWatchlistsData = _.cloneDeep(watchlistsData) || []
    const index = updatedWatchlistsData.findIndex(_watchlistData => _watchlistData.id === id)
    const updatedWatchlistData = index > -1 && { ...updatedWatchlistsData[index], coin_ids: _.uniq(coinIds) }

    if (index > -1) {
      updatedWatchlistsData[index] = updatedWatchlistData
    }

    dispatch({
      type: WATCHLISTS_DATA,
      value: updatedWatchlistsData,
      saveId: id
    })
  }

  const onShare = () => {
    if (watchlistData) {
      const updatedWatchlistsData = _.cloneDeep(watchlistsData) || []
      const index = updatedWatchlistsData.findIndex(_watchlistData => _watchlistData.id === id)
      const updatedWatchlistData = index > -1 && { ...updatedWatchlistsData[index], save: true }

      if (index > -1) {
        updatedWatchlistsData[index] = updatedWatchlistData
      }

      dispatch({
        type: WATCHLISTS_DATA,
        value: updatedWatchlistsData,
        saveId: id
      })
    }
  }

  const id = watchlistData && watchlistData.id

  return (
    <div className={`flex items-center justify-start sm:justify-end space-x-2 my-2 ${addOnly ? '' : 'pl-1 pr-2'}`}>
      {!addOnly && id && coinIds && coinIds.length > 0 && (
        pathname.endsWith('/[watchlist_id]') && watchlist_id ?
          <></>
          :
          <Popover
            placeholder="bottom"
            title="Share Watchlist"
            content={
              <CopyClipboard
                text={`${window.location.origin}/watchlist/${id}`}
                copyTitle={<span className="text-blue-600 dark:text-blue-400 text-xs">{window.location.origin}/watchlist/{id}</span>}
                onCopy={onShare}
              />
            }
          >
            <button
              className="btn btn-raised btn-sm btn-rounded bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-200"
            >
              <div className="flex items-center space-x-1">
                <FiShare2 size={18} className="stroke-current" />
                <span className="normal-case">Share</span>
              </div>
            </button>
          </Popover>
      )}
      <Modal
        buttonTitle={<div className="flex items-center space-x-1">
          <FiPlusCircle size={18} className="stroke-current" />
          <span className="normal-case">Add {coinIds && coinIds.length > 0 ? ' / Remove' : 'Coins'}</span>
        </div>}
        buttonClassName={`btn btn-raised btn-rounded ${addOnly ? 'btn-default bg-indigo-600 hover:bg-indigo-700 text-white hover:text-gray-100' : 'btn-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-200'}`}
        title={coinIds && coinIds.length > 0 ? 'Modify Watchlist' : 'Add Coins'}
        body={<div>
          <Search initialCoinIds={coinIds} updateCoinIds={_coinIds => setCoinIds(_coinIds)} />
          {coinIds && coinIds.length > 0 && (
            <div className="flex flex-wrap items-center mt-2">
              {coinIds.map((coinId, i) => {
                const index = all_crypto_data && all_crypto_data.coins ? all_crypto_data.coins.findIndex(coinData => coinData.id === coinId) : -1
                const coinData = index > -1 && all_crypto_data.coins[index]

                return (
                  <div
                    key={i}
                    onClick={() => setCoinIds(coinIds.filter(_coinId => _coinId !== coinId))}
                    className="cursor-pointer"
                  >
                    <Badge rounded color={`bg-indigo-600 dark:bg-indigo-700 text-white dark:text-white space-x-1 my-0.5 mr-${i < coinIds.length - 1 ? 2 : 0}`}>
                      <span className="normal-case font-medium">{coinData && coinData.name ? coinData.name : getName(coinId)}</span>
                      {coinData && coinData.symbol && (<span className="uppercase text-gray-200 dark:text-gray-200 font-light">{coinData.symbol}</span>)}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </div>}
        onCancel={() => setCoinIds((watchlistData && watchlistData.coin_ids) || [])}
        confirmButtonTitle={`Select ${coinIds.length} Coin${coinIds.length > 1 ? 's' : ''}`}
        onConfirm={() => update()}
        confirmButtonClassName="btn btn-default btn-rounded bg-indigo-600 hover:bg-indigo-700 text-white"
      />
    </div>
  )
}