import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { FiChevronRight } from 'react-icons/fi'
import { CONFIG_KEY } from '../../reducers/types'

export default function Item({ url, isExternalUrl, icon, title, badge, items, isComing, hiddenItem, hiddenItems, openItem, openItems }) {
  const dispatch = useDispatch()
  const { config } = useSelector(state => ({ config: state.config }), shallowEqual)
  const { collapsed } = { ...config }

  const router = useRouter()
  const { asPath } = { ...router }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (!hidden && items && items.length > 0 && hiddenItem) {
      setHidden(true)
    }
  }, [url, items, hiddenItem])

  useEffect(() => {
    if (!hidden && items && items.length > 0 && openItem && openItem.url !== url) {
      setHidden(true)
    }
  }, [url, items, openItem])

  const active = url === _asPath || (items && items.findIndex(item => item.url === _asPath && !item.is_shortcut) > -1)

  if (!items || items.length === 0) {
    return (
      isComing ?
        <span className="left-sidebar-item">
          {icon}
          <span className="title flex flex-col text-xs">
            <span>{title}</span>
            <span className="text-gray-400 dark:text-gray-600 font-light">Coming Soon</span>
          </span>
        </span>
        :
        <Link href={url}>
          <a
            target={isExternalUrl ? '_blank' : '_self'}
            rel={isExternalUrl ? 'noopener noreferrer' : ''}
            onClick={() => {
              if (!collapsed) {
                dispatch({
                  type: CONFIG_KEY,
                  key: 'collapsed',
                  value: !collapsed
                })
              }
              else if (hiddenItems) {
                hiddenItems()
              }
            }}
            className={`left-sidebar-item ${active ? 'active' : ''}`}
          >
            {icon}
            <span className="title">{title}</span>
            {badge && (
              <span className={`badge badge-circle badge-sm ${badge.color}`}>
                {badge.text}
              </span>
            )}
          </a>
        </Link>
    )
  }

  return (
    <button
      onClick={() => {
        if (hidden && openItems) {
          openItems()
        }
        setHidden(!hidden)
      }}
      className={`left-sidebar-item ${active ? 'active' : ''} ${hidden ? 'hidden-sibling' : 'open-sibling'}`}
    >
      {icon}
      <span className="title">{title}</span>
      {badge && (
        <span className={`badge badge-circle badge-sm ${badge.color}`}>
          {badge.text}
        </span>
      )}
      <FiChevronRight className="ml-auto arrow" />
    </button>
  )
}