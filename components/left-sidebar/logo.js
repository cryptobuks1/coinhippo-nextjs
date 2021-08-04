import Link from 'next/link'
import Image from 'next/image'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { FiMenu } from 'react-icons/fi'
import { CONFIG_KEY } from '../../reducers/types'

export default function Logo({ noSiderbar, className = '' }) {
  const dispatch = useDispatch()
  const { config, leftSidebar } = useSelector(state => ({ config: state.config, leftSidebar: state.leftSidebar }), shallowEqual)
  const { name, collapsed } = { ...config }
  const { showLogo } = { ...leftSidebar }

  if (showLogo) {
    return (
      <div className={`logo truncate ${className}`}>
        <Link href="/">
          <a
            onClick={() => {
              if (!collapsed) {
                dispatch({
                  type: CONFIG_KEY,
                  key: 'collapsed',
                  value: !collapsed
                })
              }
            }}
            className="flex flex-row items-center justify-start space-x-2"
          >
            <Image src="/logos/api/coinhippo.png" alt="" width={48} height={48} className="rounded-full" />
            {!noSiderbar && (<span className="text-indigo-600 dark:text-indigo-400">{name}</span>)}
          </a>
        </Link>
        {!noSiderbar && (
          <button
            onClick={() =>
              dispatch({
                type: CONFIG_KEY,
                key: 'collapsed',
                value: !collapsed
              })
            }
            className="block md:hidden ml-auto mr-4">
            <FiMenu size={20} />
          </button>
        )}
      </div>
    )
  }

  return null
}