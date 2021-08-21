import Head from 'next/head'
import Router from 'next/router'
import { Provider } from 'react-redux'
import NProgress from 'nprogress'
import { useStore } from '../store'
import Layout from '../layouts'
import '../styles/tailwind.css'
import '../styles/global.css'
import '../styles/layout.css'
import '../styles/animate.css'
import '../styles/components/navbar.css'
import '../styles/components/left-sidebar/styles-lg.css'
import '../styles/components/left-sidebar/styles-sm.css'
import '../styles/components/skeleton.css'
import '../styles/components/buttons.css'
import '../styles/components/dropdowns.css'
import '../styles/components/nprogress.css'
import '../styles/components/modals.css'
import '../styles/components/tables.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'video-react/dist/video-react.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#050707" />
        <meta
          name="msapplication-TileImage"
          content="/icons/mstile-150x150.png"
        />
        <meta name="theme-color" content="#050707" />
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}