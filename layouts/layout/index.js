import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Navbar from '../../components/navbar'
import LeftSidebar from '../../components/left-sidebar'
import Footer from '../../components/footer'
import meta from '../../lib/meta'
import { VS_CURRENCY, THEME } from '../../reducers/types'

export default function Layout({ children, noSiderbar }) {
  const dispatch = useDispatch()
  const { preferences, config, theme } = useSelector(state => ({ preferences: state.preferences, config: state.config, theme: state.theme }), shallowEqual)
  const { vs_currency } = { ...preferences }
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
    }
  }, [])

  const headMeta = meta(asPath)

  return (
    <>
      <Head>
        <title>{headMeta.title || title}</title>
        <meta name="og:site_name" property="og:site_name" content={headMeta.title} />
        <meta name="og:title" property="og:title" content={headMeta.title} />
        <meta itemprop="name" content={headMeta.title} />
        <meta itemprop="headline" content={headMeta.title} />
        <meta itemprop="publisher" content={headMeta.title} />
        <meta name="twitter:title" content={headMeta.title} />

        <meta name="description" content={headMeta.description} />
        <meta name="og:description" property="og:description" content={headMeta.description} />
        <meta itemprop="description" content={headMeta.description} />
        <meta name="twitter:description" content={headMeta.description} />

        <meta name="og:image" property="og:image" content={headMeta.image} />
        <meta itemprop="thumbnailUrl" content={headMeta.image} />
        <meta itemprop="image" content={headMeta.image} />
        <meta name="twitter:image" content={headMeta.image} />
        <link rel="image_src" href={headMeta.image} />

        <meta name="og:url" property="og:url" content={headMeta.url} />
        <meta itemprop="url" content={headMeta.url} />
        <meta name="twitter:url" content={headMeta.url} />
        <link rel="canonical" href={headMeta.url} />
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
          {!noSiderbar && (<LeftSidebar />)}
          <div className="main w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Navbar noSiderbar={noSiderbar} />
            <div className="min-h-screen w-full p-4">{children}</div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}