import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import FeedWidget from '../components/feeds/widget'
import skeletonData from '../components/feeds/skeleton-data'
import SectionTitle from '../components/section-title'
import { CircularBadge } from '../components/badges'
import { FiClock } from 'react-icons/fi'
import { FcClock } from 'react-icons/fc'
import StackGrid from 'react-stack-grid'
import moment from 'moment'
import _ from 'lodash'
import Feeds from '../lib/api/feeds'
import { getName } from '../lib/utils'

export default function FeedsIndex() {
  const { theme } = useSelector(state => ({ theme: state.theme }), shallowEqual)
  const { background } = { ...theme }

  const [feedsData, setFeedsData] = useState(null)
  const [feedTypesSelect, setFeedTypesSelect] = useState([])
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    const getFeeds = async () => {
      const response = await Feeds({ method: 'query', limit: 60, order: 'desc', ':id': 'feeds', ':time': moment().subtract(1, 'days').unix(), key: 'ID = :id', filter: 'CreatedAt > :time' })

      if (response) {
        setFeedsData(response.data ?
          response.data.flatMap(feedData => feedData.FeedType === 'whales' && feedData.Json ?
            JSON.parse(feedData.Json).map(tx => {
              return { ...feedData, Json: JSON.stringify([tx]) }
            })
            : feedData
          ) : []
        )
      }
    }

    getFeeds()

    const interval = setInterval(() => getFeeds(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setFeedTypesSelect(feedTypesSelect.filter(feedType => feedsData && feedsData.findIndex(feedData => feedData.FeedType === feedType) > -1))
  }, [feedsData])

  useEffect(() => {
    const run = async () => setTimer(moment().unix())

    if (!timer) {
      run()
    }

    const interval = setInterval(() => run(), 30 * 1000)
    return () => clearInterval(interval)
  }, [timer])

  const isSkeleton = feedsData ? false : true
  const skeletonColor = background === 'dark' ? 'bg-gray-800' : 'bg-gray-100'

  const feedTypesCount = _.countBy(feedsData, 'FeedType')

  return (
    <>
      <SectionTitle
        title={<><span className="mr-1.5">{moment().format('MMM D, YYYY')}</span><span className="absolute inline-flex items-center">{background === 'dark' ? <FiClock size={16} className="mr-1" /> : <FcClock size={16} className="mr-0.5" />}{moment().format('LT')}</span></>}
        subtitle="Latest Feeds"
        right={
          <div className="flex items-center overflow-x-scroll ml-4 py-1">
            {isSkeleton ?
              [...Array(3).keys()].map(i => (
                <div key={i} className={`${skeletonColor} animate-pulse w-20 h-8 rounded ml-3`} />
              ))
              :
              Object.keys(feedTypesCount).map(i => (
                <button
                  key={i}
                  onClick={() => setFeedTypesSelect(_.uniq(feedTypesSelect.includes(i) ? feedTypesSelect.filter(feedType => feedType !== i) : feedTypesSelect.concat([i])))}
                  className={`btn btn-raised btn-rounded flex items-center ${feedTypesSelect.includes(i) ? 'bg-indigo-600 text-white' : `bg-transparent hover:bg-${background === 'dark' ? 'indigo-900 text-white hover:text-gray-200' : 'indigo-50 text-indigo-500 hover:text-indigo-600'}`} text-xs ml-2 md:ml-3 p-2`}
                >
                  {getName(i)}<CircularBadge color="bg-indigo-600 text-white ml-1">{feedTypesCount[i]}</CircularBadge>
                </button>
              ))
            }
          </div>
        }
      />
      <StackGrid
        columnWidth={326}
        gutterWidth={12}
        gutterHeight={12}
      >
        {(feedsData ? feedsData.filter(feedData => feedTypesSelect.length < 1 || feedTypesSelect.includes(feedData.FeedType)) : skeletonData(20)).map((feedData, i) => (
          <FeedWidget
            key={i}
            feedType={feedData.FeedType}
            data={feedData}
          />
        ))}
      </StackGrid>
    </>
  )
}