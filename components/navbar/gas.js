import PropTypes from 'prop-types'

const Gas = ({ data }) => {
  const { LastBlock, SafeGasPrice, ProposeGasPrice, FastGasPrice } = { ...data }

  return (
    <>
      <div className="flex items-center font-semibold pt-2 px-3">
        <a href="https://etherscan.io/gastracker" target="_blank" rel="noopener noreferrer" className="text-blue-500">ETH Gas</a>
        <span className="ml-auto" />
        <div className="flex items-center text-xs">
          <span className="text-gray-400 font-light mr-1">Block:</span>
          <a href={`https://etherscan.io/block/${LastBlock}`} target="_blank" rel="noopener noreferrer" className="text-green-500">{LastBlock}</a>
        </div>
      </div>
      <div className="flex flex-wrap text-center">
        {[SafeGasPrice, ProposeGasPrice, FastGasPrice].map((item, i) => (
          <div
            key={i}
            className="dropdown-item w-1/3 h-20 flex flex-col items-center justify-center space-y-1"
          >
            <span className="text-sm font-bold">{item} Gwei</span>
            <span className="text-gray-400 text-xs font-light">{i === 0 ? 'Slow' : i === 1 ? 'Standard' : 'Fast'}</span>
          </div>
        ))}
      </div>
      <div className="text-gray-400 text-xs font-light text-right pb-2 px-3">
        Powered by <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="text-blue-500">Etherscan</a>
      </div>
    </>
  )
}

Gas.propTypes = {
  data: PropTypes.any,
}

export default Gas
