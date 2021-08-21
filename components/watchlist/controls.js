import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Modal from '../modals/modal-confirm-default'
import Image from '../image'
import { FiPlusCircle } from 'react-icons/fi'
import _ from 'lodash'
import { getName } from '../../lib/utils'
import { WATCHLISTS_DATA } from '../../reducers/types'

export default function Controls({ watchlistsData, watchlistData }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { all_crypto_data, trending_data } = { ...data }

  const [coinIds, setCoinIds] = useState((watchlistData && watchlistData.coin_ids) || [])

  const id = watchlistData && watchlistData.id

  const update = () => {
    const updatedWatchlistsData = _.cloneDeep(watchlistsData) || []
    const index = updatedWatchlistsData.findIndex(_watchlistData => _watchlistData.id === id)
    const updatedWatchlistData = index > -1 && { ...updatedWatchlistsData[index], coin_ids: _.uniq(coinIds) }

    if (index > -1) {
      updatedWatchlistsData[index] = updatedWatchlistData
    }

    localStorage.setItem(WATCHLISTS_DATA, JSON.stringify(updatedWatchlistsData))

    dispatch({
      type: WATCHLISTS_DATA,
      value: updatedWatchlistsData
    })
  }

  return (
    <div className="flex items-center justify-start sm:justify-end space-x-1 my-2 pl-1 pr-2">
      <Modal
        buttonTitle={<div className="flex items-center space-x-1">
          <FiPlusCircle size={18} className="stroke-current" />
          <span>Add Coins</span>
        </div>}
        buttonClassName="btn btn-raised btn-sm btn-rounded bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-200"
        title="Add Coins"
        body={<div>
          
          <div className="flex items-center mt-2">
            {coinIds.map((coinId, i) => {
              const index = all_crypto_data && all_crypto_data.coins ? all_crypto_data.coins.findIndex(coinData => coinData.id === coinId) : -1
              const coinData = index > -1 && all_crypto_data.coins[index]

              return (
                <Badge key={i} rounded color={`bg-indigo-500 text-white space-x-1 my-0.5 mr-${i < coinIds.length - 1 ? 2 : 0}`}>
                  {coinData && coinData.large && (
                    <Image
                      src={coinData.large}
                      alt=""
                      width={16}
                      height={16}
                      className="rounded"
                    />
                  )}
                  <span className="font-medium">{coinData && coinData.name ? coinData.name : getName(coinId)}</span>
                  {coinData && coinData.symbol && (<span className="uppercase text-gray-400 font-normal">{coinData.symbol}</span>)}
                </Badge>
              )
            })}
          </div>
        </div>}
        confirmButtonTitle={`Select ${coinIds.length} Coin${coinIds.length > 1 ? 's' : ''}`}
        onConfirm={() => update()}
        confirmButtonClassName="btn btn-default btn-rounded bg-indigo-500 hover:bg-indigo-600 text-white"
      />
    </div>
  )
}