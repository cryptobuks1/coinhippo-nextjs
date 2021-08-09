import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Global from '../components/dashboard/global'
import FearAndGreed from '../components/dashboard/fear-and-greed'
import Dominance from '../components/dashboard/dominance'
import TopMovers from '../components/dashboard/top-movers'
import Trending from '../components/dashboard/trending'
import SectionTitle from '../components/section-title'
import { Badge } from '../components/badges'
import { TiArrowRight } from 'react-icons/ti'
import { cryptoGlobal, simplePrice } from '../lib/api/coingecko'
import FearAndGreedAPI from '../lib/api/fear-and-greed'
import { navigation } from '../lib/menus'
import { isMatchRoute } from '../lib/routes'
import useMountedRef from '../lib/mountedRef'
import { getName } from '../lib/utils'
import { GLOBAL_DATA } from '../reducers/types'

export default function Index() {
  const dispatch = useDispatch()
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }

  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { widget } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [bitcoin, setBitcoin] = useState(null)
  const [fearAndGreedData, setFearAndGreedData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getBitcoin = async () => {
      const response = await simplePrice({ ids: 'bitcoin', vs_currencies: vs_currency, include_market_cap: true, include_24hr_change: true })

      if (response && response.bitcoin) {
        if (mountedRef.current) {
          setBitcoin(response.bitcoin)
        }
      }
    }

    if ((query && Object.keys(query).length > 0 && !widget) || _asPath === asPath) {
      getBitcoin()
    }

    const interval = setInterval(() => getBitcoin(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [vs_currency, query, widget])

  useEffect(() => {
    const getCryptoGlobal = async () => {
      const response = await cryptoGlobal()

      if (response && response.data) {
        dispatch({
          type: GLOBAL_DATA,
          value: response.data
        })
      }
    }

    if ((query && Object.keys(query).length > 0 && (!widget || ['dominance'].includes(widget))) || _asPath === asPath) {
      getCryptoGlobal()
    }

    const interval = setInterval(() => getCryptoGlobal(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [query, widget])

  useEffect(() => {
    const getFearAndGreed = async () => {
      const response = await FearAndGreedAPI({ limit: 31 })

      if (response && response.data) {
        if (mountedRef.current) {
          setFearAndGreedData(response.data)
        }
      }
    }

    if ((query && Object.keys(query).length > 0 && (!widget || ['fear_and_greed'].includes(widget))) || _asPath === asPath) {
      getFearAndGreed()
    }
  }, [query, widget])

  if (typeof window !== 'undefined' && pathname !== _asPath) {
    router.push(isMatchRoute(_asPath) ? asPath : '/404')
  }

  if (typeof window === 'undefined' || pathname !== _asPath) {
    return (
      <span className="min-h-screen" />
    )
  }

  return (
    <>
      {!widget && (
        <SectionTitle
          title="Overview"
          subtitle="Dashboard"
          right={<div className="flex flex-wrap items-center ml-0 sm:ml-4">
            {navigation.filter(item => item.index_shortcut || item.items.findIndex(_item => _item.index_shortcut || _item.items.findIndex(__item => __item.index_shortcut) > -1) > -1)
              .flatMap(item => item.index_shortcut ? item : item.items.flatMap(_item => _item.index_shortcut ? _item : _item.items.filter(__item => __item.index_shortcut)))
              .map((navigationItemData, i) => (
                <Link key={i} href={navigationItemData.url}>
                  <a>
                    <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium mt-1 mr-1 py-1 pl-1.5 pr-1">
                      {navigationItemData.index_shortcut}
                      <TiArrowRight size={16} className="transform -rotate-45" />
                    </Badge>
                  </a>
                </Link>
              ))
            }
          </div>}
          className="flex-col sm:flex-row items-start sm:items-center mx-1"
        />
      )}
      {!widget && (
        <Global bitcoin={bitcoin} />
      )}
      <div className={`w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-2 xl:gap-4 mb-4 lg:mb-2 xl:mb-4 ${query.theme === 'dark' && widget ? '-mt-4 -ml-4' : ''}`}>
        {(!widget || ['fear_and_greed'].includes(widget)) && (
          <FearAndGreed data={fearAndGreedData} noBorder={['fear_and_greed'].includes(widget)} />
        )}
        {(!widget || ['dominance'].includes(widget)) && (
          <Dominance noBorder={['dominance'].includes(widget)} />
        )}
        {(!widget || ['top_movers'].includes(widget)) && (
          <TopMovers noBorder={['top_movers'].includes(widget)} />
        )}
        {(!widget || ['trending'].includes(widget)) && (
          <Trending noBorder={['trending'].includes(widget)} />
        )}
      </div>
    </>
  )
}