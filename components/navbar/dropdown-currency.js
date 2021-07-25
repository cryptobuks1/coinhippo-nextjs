import { useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Currencies from './currencies'
import { currencies } from '../../lib/menus'

export default function DropdownCurrency() {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]

  const [hidden, setHidden] = useState(true)

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

  return (
    <div className="relative ml-1 md:ml-4">
      <button
        ref={buttonRef}
        onClick={handleDropdownClick}
        className="w-8 h-16 flex items-center justify-center"
      >
        {currency.image ?
          <img
            className="w-6 h-6 rounded-full"
            src={currency.image}
            alt={currency.id.toUpperCase()}
          />
          :
          <span className={`${currency.background} w-6 h-6 rounded-full flex items-center justify-center text-white text-sm`}>
            {currency.symbol}
          </span>
        }
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 right-0 mt-12`}
      >
        <div className="dropdown-content w-64 bottom-start">
          <Currencies handleDropdownClick={handleDropdownClick} />
        </div>
      </div>
    </div>
  )
}