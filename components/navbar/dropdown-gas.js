import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Gas from './gas'
import { ProgressBar } from '../progress-bars'
import { FaGasPump } from 'react-icons/fa'
import _ from 'lodash'
import Etherscan from '../../lib/api/etherscan'
import { GAS_DATA } from '../../reducers/types'

const gas_gwei_threshold = 15
const refresh_rate_second = 15

export default function DropdownGas() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { gas_data } = { ...data }

  const [hidden, setHidden] = useState(true)
  const [secondUntilRefresh, setSecondUntilRefresh] = useState(refresh_rate_second)

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        hidden ||
        buttonRef.current.contains(event.target) ||
        dropdownRef.current.contains(event.target)
      ) {
        return false
      }
      setHidden(!hidden)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const handleDropdownClick = () => setHidden(!hidden)

  useEffect(() => {
    const interval = setInterval(() => setSecondUntilRefresh(secondUntilRefresh - 1 || refresh_rate_second), 1000)
    return () => clearInterval(interval)
  }, [secondUntilRefresh])

  useEffect(() => {
    const getGas = async () => {
      const response = await Etherscan({ module: 'gastracker', action: 'gasoracle' })

      if (response && response.result) {
        dispatch({
          type: GAS_DATA,
          value: response.result
        })
      }
    }

    if (secondUntilRefresh === refresh_rate_second) {
      getGas()
    }
  }, [secondUntilRefresh])

  const avgGas = gas_data && _.mean([gas_data.SafeGasPrice, gas_data.ProposeGasPrice, gas_data.FastGasPrice].map(gas => Number(gas)))

  const color = gas_data && typeof gas_data === 'object' ? avgGas <= gas_gwei_threshold ? 'green-700' : avgGas <= gas_gwei_threshold * 2 ? 'green-500' : avgGas <= gas_gwei_threshold * 4 ? 'red-500' : 'red-700' : 'gray-500'

  return gas_data && (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleDropdownClick}
        className={`w-8 h-16 flex flex-col items-center justify-center text-${color}`}
      >
        <FaGasPump size={20} className="mb-1" />
        <ProgressBar width={secondUntilRefresh * 100 / refresh_rate_second} color={`bg-${color}`} className="h-0.5" />
        <span
          className={`bg-${color} w-5 h-5 absolute leading-none rounded-full text-white text-2xs font-semibold inline-flex items-center justify-center`}
          style={{ top: 4, right: -2 }}
        >
          {gas_data.ProposeGasPrice || '?'}
        </span>
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 right-0 mt-12`}
      >
        <div className="dropdown-content w-64 bottom-start">
          <Gas data={gas_data} />
        </div>
      </div>
    </div>
  )
}