import Head from 'next/head'
import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Navbar from '../../components/navbar'
import LeftSidebar from '../../components/left-sidebar'
import { VS_CURRENCY, THEME } from '../../reducers/types'

export default function Layout({ children }) {
  const dispatch = useDispatch()
  const { preferences, config, theme } = useSelector(state => ({ preferences: state.preferences, config: state.config, theme: state.theme }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { title, layout, collapsed } = { ...config }
  const { background, navbar, leftSidebar } = { ...theme }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(VS_CURRENCY) && localStorage.getItem(VS_CURRENCY) !== vs_currency) {
        dispatch({
          type: VS_CURRENCY,
          value: localStorage.getItem(VS_CURRENCY)
        })
      }

      if (localStorage.getItem(THEME) && localStorage.getItem(THEME) !== background) {
        dispatch({
          type: THEME,
          value: localStorage.getItem(THEME)
        })
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div
        data-layout={layout}
        data-collapsed={collapsed}
        data-background={background}
        data-navbar={navbar}
        data-left-sidebar={leftSidebar}
        className={`font-sans antialiased text-sm disable-scrollbars ${background === 'dark' ? 'dark' : ''}`}
      >
        <div className="wrapper">
          <LeftSidebar />
          <div className="main w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Navbar />
            <div className="min-h-screen w-full p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}