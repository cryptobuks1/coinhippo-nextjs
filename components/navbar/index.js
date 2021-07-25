import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Logo from '../left-sidebar/logo'
import Search from './search'
import DropdownGas from './dropdown-gas'
import DropdownCurrency from './dropdown-currency'
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import { CONFIG_KEY, THEME } from '../../reducers/types'

export default function Navbar({ noSiderbar }) {
  const dispatch = useDispatch()
  const { config, theme } = useSelector(state => ({ config: state.config, theme: state.theme }), shallowEqual)
  const { collapsed } = { ...config }
  const { background } = { ...theme }

  return (
    <div className="navbar border-b">
      <div className="navbar-inner w-full flex items-center justify-start">
        {!noSiderbar ?
          <button
            onClick={() =>
              dispatch({
                type: CONFIG_KEY,
                key: 'collapsed',
                value: !collapsed
              })
            }
            className="mx-4"
          >
            <FiMenu size={20} />
          </button>
          :
          <Logo noSiderbar={noSiderbar} className="mx-3 mb-1" />
        }
        <Search />
        <span className="ml-auto" />
        <DropdownGas />
        <DropdownCurrency />
        <button
          onClick={() => {
            const themeSet = background === 'light' ? 'dark' : 'light'
            dispatch({
              type: THEME,
              value: themeSet
            })
            localStorage.setItem(THEME, themeSet)
          }}
          className="w-8 h-16 btn-transparent flex items-center justify-center mx-1 md:mx-4"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            {background === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
          </div>
        </button>
      </div>
    </div>
  )
}