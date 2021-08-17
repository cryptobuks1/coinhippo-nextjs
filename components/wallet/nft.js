import Summary from './summary'
import NFTWidget from './nft-widget'
import StackGrid from 'react-stack-grid'

export default function NFT({ balancesData, contractData }) {
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