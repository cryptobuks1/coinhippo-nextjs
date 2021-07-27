import { useState, useEffect } from 'react'
import FeedWidget from '../components/feeds/widget'
import skeletonData from '../components/feeds/skeleton-data'
import SectionTitle from '../components/section-title'
import { Badge } from '../components/badges'
import { FaTwitter, FaTelegram, FaWhatsapp } from 'react-icons/fa'
import StackGrid from 'react-stack-grid'
import moment from 'moment'
import Feeds from '../lib/api/feeds'

export default function FeedsIndex() {
  const [feedsData, setFeedsData] = useState(null)

  useEffect(() => {
    const getFeeds = async () => {
      const response = await Feeds({ method: 'query', limit: 60, order: 'desc', ':id': 'feeds', ':time': moment().subtract(1, 'days').unix(), key: 'ID = :id', filter: 'CreatedAt > :time' })

      if (response) {
        setFeedsData(response.data || [])
      }
    }

    getFeeds()

    const interval = setInterval(() => getFeeds(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <SectionTitle title="Latest" subtitle="Feeds" />
      <StackGrid
        columnWidth={326}
        gutterWidth={12}
        gutterHeight={12}
      >
        {(feedsData ? feedsData : skeletonData(20)).map(feedData => (
          <FeedWidget
            key={feedData.SortKey}
            feedType={feedData.FeedType}
            data={feedData}
          />
        ))}
      </StackGrid>
    </>
  )
}