import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

export default function Item({ url, icon, title, badge, items }) {
  const [hidden, setHidden] = useState(true)

  const router = useRouter()
  const { pathname } = { ...router }

  let active = pathname === url ? true : false
  if (pathname === '/') {
    active = url === '/dashboard'
  }

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