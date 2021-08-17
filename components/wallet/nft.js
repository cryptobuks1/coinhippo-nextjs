import { useState, useEffect } from 'react'
import Summary from './summary'
import NFTWidget from './nft-widget'
import StackGrid from 'react-stack-grid'
import moment from 'moment'

export default function NFT({ balancesData, contractData }) {
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    const run = async () => setTimer(moment().unix())

    if (!timer) {
      run()
    }

    const interval = setInterval(() => run(), 0.5 * 1000)
    return () => clearInterval(interval)
  }, [timer])

  return (
    <>
      <Summary balancesData={balancesData} contractData={contractData} />
      <div className="my-4 mx-auto">
        <StackGrid
          columnWidth={324}
          gutterWidth={12}
          gutterHeight={12}
        >
          {(balancesData ? balancesData.map((balanceData, i) => { return { ...balanceData, i } }) : [...Array(4).keys()].map(i => {return { i, skeleton: true } })).map((balanceData, i) => (
            <NFTWidget
              key={i}
              data={balanceData}
              i={i}
            />
          ))}
        </StackGrid>
      </div>
    </>
  )
}