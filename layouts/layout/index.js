import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Navbar from '../../components/navbar'
import LeftSidebar from '../../components/left-sidebar'
import Footer from '../../components/footer'
import _ from 'lodash'
import meta from '../../lib/meta'
import { VS_CURRENCY, THEME, WATCHLISTS_DATA } from '../../reducers/types'

export default function Layout({ children, noSiderbar, noNavbar, noFooter, customTheme }) {
  const dispatch = useDispatch()
  const { preferences, watchlistsData, config, theme } = useSelector(state => ({ preferences: state.preferences, watchlistsData: state.watchlistsData, config: state.config, theme: state.theme }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { watchlists_data } = { ...watchlistsData }
  const { title, layout, collapsed } = { ...config }
  const { background, navbar, leftSidebar } = { ...theme }

  const router = useRouter()
  const { asPath } = { ...router }

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

      if (localStorage.getItem(WATCHLISTS_DATA) && !_.isEqual(JSON.parse(localStorage.getItem(WATCHLISTS_DATA)), watchlists_data)) {
        dispatch({
          type: WATCHLISTS_DATA,
          value: JSON.parse(localStorage.getItem(WATCHLISTS_DATA))
        })
      }
    }
  }, [vs_currency, background])

  const headMeta = meta(asPath)

  return (
    <>
      <Head>
        <title>{headMeta.title || title}</title>
        <meta name="og:site_name" property="og:site_name" content={headMeta.title} />
        <meta name="og:title" property="og:title" content={headMeta.title} />
        <meta itemProp="name" content={headMeta.title} />
        <meta itemProp="headline" content={headMeta.title} />
        <meta itemProp="publisher" content={headMeta.title} />
        <meta name="twitter:title" content={headMeta.title} />

        <meta name="description" content={headMeta.description} />
        <meta name="og:description" property="og:description" content={headMeta.description} />
        <meta itemProp="description" content={headMeta.description} />
        <meta name="twitter:description" content={headMeta.description} />

        <meta name="og:image" property="og:image" content={headMeta.image} />
        <meta itemProp="thumbnailUrl" content={headMeta.image} />
        <meta itemProp="image" content={headMeta.image} />
        <meta name="twitter:image" content={headMeta.image} />
        <link rel="image_src" href={headMeta.image} />

        <meta name="og:url" property="og:url" content={headMeta.url} />
        <meta itemProp="url" content={headMeta.url} />
        <meta name="twitter:url" content={headMeta.url} />
        <link rel="canonical" href={headMeta.url} />
      </Head>
      <div
        data-layout={layout}
        data-collapsed={collapsed}
        data-background={customTheme || background}
        data-navbar={customTheme || navbar}
        data-left-sidebar={customTheme || leftSidebar}
        className={`font-sans antialiased text-sm disable-scrollbars ${customTheme === 'dark' || background === 'dark' ? 'dark' : ''}`}
      >
        <div className="wrapper">
          {!noSiderbar && (<LeftSidebar />)}
          <div className="main w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            {!noNavbar && (<Navbar noSiderbar={noSiderbar} />)}
            <div className="w-full min-h-screen p-4">{children}</div>
          </div>
        </div>
        {!noFooter && (<Footer />)}
      </div>
    </>
  )
}