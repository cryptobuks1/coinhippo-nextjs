import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Global from '../components/dashboard/global'
import FearAndGreed from '../components/dashboard/fear-and-greed'
import Dominance from '../components/dashboard/dominance'
import SectionTitle from '../components/section-title'
import { cryptoGlobal } from '../lib/api/coingecko'
import FearAndGreedAPI from '../lib/api/fear-and-greed'
import { getName } from '../lib/utils'
import { GLOBAL_DATA } from '../reducers/types'

export default function Index() {
  const dispatch = useDispatch()

  const [fearAndGreedData, setFearAndGreedData] = useState(null)

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

    getCryptoGlobal()

    const interval = setInterval(() => getCryptoGlobal(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getFearAndGreed = async () => {
      const response = await FearAndGreedAPI({ limit: 31 })

      if (response && response.data) {
        setFearAndGreedData(response.data)
      }
    }

    getFearAndGreed()
  }, [])

  return (
    <>
      <SectionTitle title="Overview" subtitle="Dashboard" />
      <Global />
      <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <FearAndGreed data={fearAndGreedData} />
        <Dominance />
      </div>
    </>
  )
}