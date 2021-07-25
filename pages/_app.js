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
import '../styles/components/buttons.css'
import '../styles/components/dropdowns.css'

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
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}