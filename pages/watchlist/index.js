import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Title from '../../components/watchlist/title'
import List from '../../components/watchlist/list'
import Controls from '../../components/watchlist/controls'
import Coins from '../../components/coins'
import SectionTitle from '../../components/section-title'
import { WATCHLISTS_DATA } from '../../reducers/types'

export default function Watchlist() {
  const dispatch = useDispatch()
  const { watchlist } = useSelector(state => ({ watchlist: state.watchlist }), shallowEqual)
  const { watchlists_data } = { ...watchlist }

  const [watchlistData, setWatchlistData] = useState((watchlists_data || [])[0])
  const [editZone, setEditZone] = useState('')

  useEffect(() => {
    if (!watchlistData && watchlists_data) {
      setWatchlistData(watchlists_data[0])
    }
    else if (watchlistData) {
      const index = watchlists_data ?
        watchlists_data.findIndex(_watchlistData => !_watchlistData.id) > -1 ?
          watchlists_data.findIndex(_watchlistData => !_watchlistData.id)
          :
          watchlists_data.findIndex(_watchlistData => _watchlistData.id === watchlistData.id)
        :
        -1
      setWatchlistData(index > -1 ? watchlists_data[index] : (watchlists_data || [])[0])
    }
  }, [watchlists_data])

  const onSelect = item => {
    setWatchlistData(item)

    if (item && item.id && watchlists_data && watchlists_data.findIndex(_watchlistData => !_watchlistData.id) > -1) {
      const updatedWatchlistsData = _.cloneDeep(watchlists_data).filter(_watchlistData => _watchlistData.id)

      dispatch({
        type: WATCHLISTS_DATA,
        value: updatedWatchlistsData
      })
    }

    if (item && !item.id) {
      setEditZone('title')
    }
  }

  return (
    <>
      <SectionTitle
        title="Watchlist"
        subtitle={<Title
          watchlistsData={watchlists_data}
          watchlistData={watchlistData}
          onSelect={onSelect}
          editZone={editZone}
          setEditZone={zone => setEditZone(typeof zone === 'string' ? zone : 'title')}
        />}
        right={<List
          watchlistsData={watchlists_data}
          watchlistData={watchlistData}
          onSelect={onSelect}
          editZone={editZone}
          setEditZone={zone => setEditZone(typeof zone === 'string' ? zone : 'list')}
        />}
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      {!editZone && watchlistData && watchlistData.id && (
        <Controls
          watchlistsData={watchlists_data}
          watchlistData={watchlistData}
        />
      )}
      <Coins
        watchlistData={watchlistData}
        addCoinsButton={!editZone && watchlistData && watchlistData.id && (
          <Controls
            watchlistsData={watchlists_data}
            watchlistData={watchlistData}
            addOnly={true}
          />
        )}
      />
    </>
  )
}