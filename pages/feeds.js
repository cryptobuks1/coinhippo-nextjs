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

  const [feedsData, setFeedsData] = useState(skeletonData(16))
  const [feedTypesSelect, setFeedTypesSelect] = useState([])
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    const getFeeds = async () => {
      const response = await Feeds({ method: 'query', limit: 48, order: 'desc', ':id': 'feeds', ':time': moment().subtract(1, 'days').unix(), key: 'ID = :id', filter: 'CreatedAt > :time' })

      if (response) {
        setFeedsData(response.data ?
          response.data.flatMap(feedData => feedData.FeedType === 'whales' && feedData.Json ?
            JSON.parse(feedData.Json).map(tx => {
              return { ...feedData, Json: JSON.stringify(tx) }
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
    setFeedTypesSelect(feedTypesSelect.filter(feedType => feedsData.findIndex(feedData => feedData.FeedType === feedType) > -1))
  }, [feedsData])

  useEffect(() => {
    const run = async () => setTimer(moment().unix())

    if (!timer) {
      run()
    }

    const interval = setInterval(() => run(), 0.5 * 1000)
    return () => clearInterval(interval)
  }, [timer])

  const isSkeleton = feedsData.findIndex(feedData => feedData.ID === 'skeleton') > -1
  const skeletonColor = background === 'dark' ? 'bg-gray-800' : 'bg-gray-100'

  const feedTypesCount = _.countBy(feedsData, 'FeedType')

  return (
    <>
      <SectionTitle
        title={<><span className="mr-1.5">{moment().format('MMM D, YYYY')}</span><span className="absolute inline-flex items-center">{background === 'dark' ? <FiClock size={16} className="mr-1" /> : <FcClock size={16} className="mr-0.5" />}{moment().format('LT')}</span></>}
        subtitle="Latest Feeds"
        right={
          <div className="flex flex-wrap items-center ml-0 sm:ml-4 px-1">
            {isSkeleton ?
              [...Array(3).keys()].map(i => (
                <div key={i} className={`${skeletonColor} animate-pulse w-20 h-8 rounded mr-${i < 3 - 1 ? 2 : 0}`} />
              ))
              :
              Object.keys(feedTypesCount).map((feedType, i) => (
                <button
                  key={feedType}
                  onClick={() => setFeedTypesSelect(_.uniq(feedTypesSelect.includes(feedType) ? feedTypesSelect.filter(_feedType => _feedType !== feedType) : feedTypesSelect.concat([feedType])))}
                  className={`btn btn-raised min-w-max btn-rounded flex items-center ${feedTypesSelect.includes(feedType) ? 'bg-indigo-600 text-white' : `bg-transparent hover:bg-${background === 'dark' ? 'indigo-900 text-white hover:text-gray-200' : 'indigo-50 text-indigo-500 hover:text-indigo-600'}`} text-xs my-1 ${i < Object.keys(feedTypesCount).length - 1 ? 'mr-2 md:mr-3' : ''} p-2`}
                >
                  {getName(feedType)}<CircularBadge color="bg-indigo-600 text-white ml-1">{feedTypesCount[feedType]}</CircularBadge>
                </button>
              ))
            }
          </div>
        }
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      <StackGrid
        columnWidth={326}
        gutterWidth={12}
        gutterHeight={12}
      >
        {(isSkeleton ? feedsData : feedsData.filter(feedData => feedTypesSelect.length < 1 || feedTypesSelect.includes(feedData.FeedType))).map((feedData, i) => (
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