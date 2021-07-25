import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { currencies } from '../../lib/menus'
import { VS_CURRENCY } from '../../reducers/types'

const Currencies = ({ handleDropdownClick }) => {
  const dispatch = useDispatch()

  return (
    <>
      <div className="dropdown-title">Change currency</div>
      <div className="flex flex-wrap pb-1">
        {currencies.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              dispatch({
                type: VS_CURRENCY,
                value: item.id
              })
              localStorage.setItem(VS_CURRENCY, item.id)
              handleDropdownClick()
            }}
            className="dropdown-item w-1/2 flex items-center justify-start text-sm space-x-2 p-2"
          >
            {item.image ?
              <img
                src={item.image}
                alt=""
                className="w-4 h-4 rounded-full"
              />
              :
              <span className={`${item.background} w-4 h-4 rounded-full flex items-center justify-center text-white text-xs`}>
                {item.symbol}
              </span>
            }
            <span className="text-xs">{item.title}</span>
          </button>
        ))}
      </div>
    </>
  )
}

Currencies.propTypes = {
  handleDropdownClick: PropTypes.any,
}

export default Currencies