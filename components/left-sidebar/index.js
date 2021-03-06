import { Fragment, useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Logo from './logo'
import Title from './title'
import Item from './item'
import Tooltip from '../tooltip'
import { navigations } from '../../lib/menus'

export default function LeftSidebar() {
  const { config } = useSelector(state => ({ config: state.config }), shallowEqual)
  const { collapsed } = { ...config }

  const [hiddenItem, setHiddenItem] = useState(null)
  const [openItem, setOpenItem] = useState(null)

  useEffect(() => {
    if (hiddenItem) {
      setHiddenItem(null)
    }
  }, [hiddenItem])

  useEffect(() => {
    if (openItem) {
      setOpenItem(null)
    }
  }, [openItem])

  return (
    <div className="left-sidebar left-sidebar-1 inline-table md:block">
      <Logo />
      {navigations.map((menu, i) => (
        typeof window !== 'undefined' && (
          <Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => (
                <li key={a} className="l0">
                  {collapsed ?
                    <Tooltip
                      placement="top"
                      content={<span className="title flex flex-col whitespace-nowrap text-xs">
                        <span>{l0.title}</span>
                        {l0.isExternalUrl && (
                          <span className="text-blue-600 dark:text-blue-400">{new URL(l0.url).hostname}</span>
                        )}
                        {l0.isComing && (
                          <span className="text-gray-400 dark:text-gray-600 font-light">Coming Soon</span>
                        )}
                      </span>}
                    >
                      <Item {...l0} hiddenItem={hiddenItem} openItem={openItem} openItems={() => setOpenItem(l0)} />
                    </Tooltip>
                    :
                    <Item {...l0} hiddenItem={hiddenItem} openItem={openItem} openItems={() => setOpenItem(l0)} />
                  }
                  <ul className={l0.itemsClassName || 'max-h-60'}>
                    {l0.items.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} hiddenItem={hiddenItem} hiddenItems={() => setHiddenItem(l0)} openItem={openItem} openItems={() => setOpenItem(l1)} />
                        <ul>
                          {l1.items.map((l2, c) => (
                            <li key={c} className="l2">
                              <Item {...l2} hiddenItem={hiddenItem} hiddenItems={() => setHiddenItem(l1)} openItem={openItem} openItems={() => setOpenItem(l2)} />
                              <ul>
                                {l2.items.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} hiddenItem={hiddenItem} hiddenItems={() => setHiddenItem(l2)} openItem={openItem} openItems={() => setOpenItem(l3)} />
                                    <ul>
                                      {l3.items.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} hiddenItem={hiddenItem} hiddenItems={() => setHiddenItem(l3)} openItem={openItem} openItems={() => setOpenItem(l4)} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Fragment>
        )
      ))}
    </div>
  )
}