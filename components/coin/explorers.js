import PropTypes from 'prop-types'
import { getName } from '../../lib/utils'

const Explorers = ({ data, handleDropdownClick }) => {
  return (
    <>
      <div className="dropdown-title">Explorers</div>
      <div className="flex flex-wrap pb-1">
        {data && data.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleDropdownClick()}
            className="dropdown-item w-full flex items-center justify-start text-sm space-x-2 mx-1 p-2"
          >
            {item.icon}
            <span>{item.value}</span>
          </a>
        ))}
      </div>
    </>
  )
}

Explorers.propTypes = {
  data: PropTypes.any,
  handleDropdownClick: PropTypes.any,
}

export default Explorers