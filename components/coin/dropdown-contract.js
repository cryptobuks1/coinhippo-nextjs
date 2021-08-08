import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Contracts from './contracts'
import { BsFileEarmarkCode } from 'react-icons/bs'

const DropdownContract = ({ data }) => {
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

  return data && data.length > 0 && (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleDropdownClick}
        className="btn min-w-max btn-raised btn-rounded btn-icon flex items-center bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800 dark:hover:bg-gray-800 dark:text-white dark:hover:text-gray-200 text-xs space-x-1.5 ml-0 sm:ml-2 mr-2 sm:mr-0 p-2"
      >
        <BsFileEarmarkCode size={16} className="stroke-current" />
        <span className="hidden lg:block">Contracts</span>
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 left-0 sm:left-auto right-0 mt-8`}
      >
        <div className="dropdown-content w-60 sm:w-64 bottom-start">
          <Contracts data={data} />
        </div>
      </div>
    </div>
  )
}

DropdownContract.propTypes = {
  data: PropTypes.any,
}

export default DropdownContract