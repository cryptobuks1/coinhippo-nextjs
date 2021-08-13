import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import MarqueeCoins from './marquee-coins'
import { coinsMarkets } from '../../lib/api/coingecko'
import useMountedRef from '../../lib/mountedRef'

export default function CoinPrices() {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { vs_currency } = { ...preferences }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const [coinsData, setCoinsData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getCoinsMarkets = async () => {
      const response = await coinsMarkets({ vs_currency, order: 'market_cap_desc', per_page: 10, page: 1, price_change_percentage: '24h' })

      if (response && Array.isArray(response)) {
        if (mountedRef.current) {
          setCoinsData(response.map(coinData => { return { ...coinData, vs_currency } }))
        }
      }
    }

    getCoinsMarkets()

    const interval = setInterval(() => getCoinsMarkets(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [vs_currency])

  return coinsData && (
    <div className={`w-full ${['price-marquee'].includes(widget) ? '' : 'hidden'} sm:block ml-1 mr-3`}>
      <MarqueeCoins data={coinsData} />
    </div>
  )
}