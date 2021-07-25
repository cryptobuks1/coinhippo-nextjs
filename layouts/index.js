import { useRouter } from 'next/router'
import Centered from './centered'
import Empty from './empty'
import Layout from './layout'

export default function Layouts({ children }) {
  const router = useRouter()
  const { pathname } = { ...router }

  if (['/404', '/500'].includes(pathname)) {
    return <Centered>{children}</Centered>
  }
  else if ([].includes(pathname)) {
    return <Empty>{children}</Empty>
  }
  else {
    return <Layout>{children}</Layout>
  }
}