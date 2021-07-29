import { useRouter } from 'next/router'
import Centered from './centered'
import Empty from './empty'
import Layout from './layout'

export default function Layouts({ children }) {
  const router = useRouter()
  const { pathname, query } = { ...router }

  if (['/404', '/500'].includes(pathname)) {
    return <Centered>{children}</Centered>
  }
  else if (['/widget'].includes(pathname) || ['widget'].includes(query.view)) {
    return <Empty>{children}</Empty>
  }
  else if (['/blog', '/blog/[category_id]', '/blog/[category_id]/[post_id]'].includes(pathname)) {
    return <Layout noSiderbar={true}>{children}</Layout>
  }
  else {
    return <Layout>{children}</Layout>
  }
}