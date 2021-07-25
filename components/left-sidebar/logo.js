import Link from 'next/link'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { FiBox, FiMenu } from 'react-icons/fi'
import { CONFIG_KEY } from '../../reducers/types'

export default function Logo() {
  const dispatch = useDispatch()
  const { config, leftSidebar } = useSelector(state => ({ config: state.config, leftSidebar: state.leftSidebar }), shallowEqual)
  const { name, collapsed } = { ...config }
  const { showLogo } = { ...leftSidebar }

  if (showLogo) {
    return (
      <div className="logo truncate">
        <Link href="/">
          <a className="flex flex-row items-center justify-start space-x-2">
            <FiBox size={28} />
            <span>{name}</span>
          </a>
        </Link>
        <button
          onClick={() =>
            dispatch({
              type: CONFIG_KEY,
              key: 'collapsed',
              value: !collapsed
            })
          }
          className="block lg:hidden ml-auto mr-4">
          <FiMenu size={20} />
        </button>
      </div>
    )
  }

  return null
}