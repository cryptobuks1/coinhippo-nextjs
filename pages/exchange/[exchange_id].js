import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Exchange from '../../components/exchange'
import SectionTitle from '../../components/section-title'
import Image from '../../components/image'
import { exchange, derivativesExchange } from '../../lib/api/coingecko'
import meta from '../../lib/meta'
import useMountedRef from '../../lib/mountedRef'
import { getName } from '../../lib/utils'

export default function ExchangeId() {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { all_crypto_data } = { ...data }

  const router = useRouter()
  const { query, asPath } = { ...router }
  const { exchange_id } = { ...query }

  const [exchangeData, setExchangesData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getExchange = async () => {
      const _exchangeData = all_crypto_data.exchanges[all_crypto_data.exchanges.findIndex(exchangeData => exchangeData.id === exchange_id)]

      const response = await (_exchangeData.market_type === 'spot' ? exchange(exchange_id) : derivativesExchange(exchange_id, { include_tickers: 'unexpired' }))

      if (response && !response.error) {
        if (mountedRef.current) {
          setExchangesData({ ...response, ..._exchangeData })
        }
      }
    }

    if (all_crypto_data && all_crypto_data.exchanges && all_crypto_data.exchanges.findIndex(exchangeData => exchangeData.id === exchange_id) > -1) {
      getExchange()
    }

    const interval = setInterval(() => getExchange(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [all_crypto_data, exchange_id])

  const headMeta = meta(asPath, exchangeData)

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
        title={<span className="space-x-1">{exchangeData && (<span>{getName(exchangeData.market_type)}</span>)}<span>Exchange</span></span>}
        subtitle={exchangeData ?
          <div className="flex items-center space-x-2 mt-1.5">
            <Image
              src={exchangeData.large || exchangeData.thumb}
              alt=""
              width={32}
              height={32}
              className="rounded"
            />
            <span>{exchangeData.name}</span>
          </div>
          :
          getName(exchange_id)
        }
        right={exchangeData ?
          exchangeData.url ?
            <a href={exchangeData.url} target="_blank" rel="noopener noreferrer" className="btn btn-raised min-w-max btn-rounded bg-indigo-600 hover:bg-indigo-700 text-white hover:text-gray-50 text-xs my-1 p-2">
              Start Trading
            </a>
            :
            null
          :
          <div className="skeleton w-28 h-8 rounded" />
        }
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      <Exchange data={exchangeData} />
    </>
  )
}