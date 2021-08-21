import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Title from '../../components/watchlist/title'
import Controls from '../../components/watchlist/controls'
import Coins from '../../components/coins'
import SectionTitle from '../../components/section-title'
import Watchlist from '../../lib/api/watchlist'
import meta from '../../lib/meta'
import useMountedRef from '../../lib/mountedRef'

export default function WatchlistId() {
  const { watchlist } = useSelector(state => ({ watchlist: state.watchlist }), shallowEqual)
  const { watchlists_data } = { ...watchlist }

  const router = useRouter()
  const { query, asPath } = { ...router }
  const { watchlist_id } = { ...query }

  const [watchlistData, setWatchlistData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getData = async () => {
      const response = await Watchlist({ method: 'get', ID: watchlist_id })

      if (response && response.data) {
        if (mountedRef.current) {
          setWatchlistData(JSON.parse(response.data.Json))
        }
      }
    }

    if (watchlist_id) {
      getData()
    }
  }, [watchlist_id])

  const headMeta = meta(asPath, watchlistData)

  return (
    <>
      <Head>
        <title>{headMeta.title}</title>
        <meta name="og:site_name" property="og:site_name" content={headMeta.title} />
        <meta name="og:title" property="og:title" content={headMeta.title} />
        <meta itemProp="name" content={headMeta.title} />
        <meta itemProp="headline" content={headMeta.title} />
        <meta itemProp="publisher" content={headMeta.title} />
        <meta name="twitter:title" content={headMeta.title} />

        <meta name="description" content={headMeta.description} />
        <meta name="og:description" property="og:description" content={headMeta.description} />
        <meta itemProp="description" content={headMeta.description} />
        <meta name="twitter:description" content={headMeta.description} />

        <meta name="og:image" property="og:image" content={headMeta.image} />
        <meta itemProp="thumbnailUrl" content={headMeta.image} />
        <meta itemProp="image" content={headMeta.image} />
        <meta name="twitter:image" content={headMeta.image} />
        <link rel="image_src" href={headMeta.image} />

        <meta name="og:url" property="og:url" content={headMeta.url} />
        <meta itemProp="url" content={headMeta.url} />
        <meta name="twitter:url" content={headMeta.url} />
        <link rel="canonical" href={headMeta.url} />
      </Head>
      <SectionTitle
        title="Watchlist"
        subtitle={watchlistData && watchlistData.title}
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      {watchlistData && watchlistData.id && (
        <Controls
          watchlistsData={watchlists_data}
          watchlistData={watchlistData}
        />
      )}
      <Coins watchlistData={watchlistData} />
    </>
  )
}