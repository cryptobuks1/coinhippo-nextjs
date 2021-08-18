import { useState, useEffect } from 'react'
import Summary from './summary'
import NFTWidget from './nft-widget'
import StackGrid from 'react-stack-grid'
import moment from 'moment'

export default function NFTs({ balancesData, contractData, loading, hasMore, pageSize, onLoadMore }) {
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
          {(balancesData ? balancesData.map((balanceData, i) => { return { ...balanceData, i } }) : [...Array(4).keys()].map(i => { return { i, skeleton: true } })).map((balanceData, i) => (
            <NFTWidget
              key={i}
              data={balanceData}
              i={i}
            />
          ))}
          {balancesData && loading && [...Array(pageSize).keys()].map(i => (
            <NFTWidget
              key={i}
              data={{ i: balancesData.length + i, skeleton: true }}
              i={balancesData.length + i}
            />
          ))}
        </StackGrid>
        {balancesData && balancesData.length > 0 && hasMore && (
          <div className="w-full text-center">
            <button disabled={loading} onClick={onLoadMore} className="btn btn-default bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-900 dark:text-gray-100 mt-3">
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  )
}