import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

export default function Item({ url, icon, title, badge, items }) {
  const router = useRouter()
  const { asPath } = { ...router }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [hidden, setHidden] = useState(true)

  const active = url === _asPath || (items && items.findIndex(item => item.url === _asPath && !item.is_shortcut) > -1)

  if (items.length === 0) {
    return (
      <Link href={url}>
        <a className={`left-sidebar-item ${active ? 'active' : ''}`}>
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
      onClick={() => setHidden(!hidden)}
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