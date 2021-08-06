import Link from 'next/link'
import { useRouter } from 'next/router'
import _ from 'lodash'
import { getName } from '../../lib/utils'

export default function Header({ blogsData }) {
  const router = useRouter()
  const { query } = { ...router }
  const { category_id } = { ...query }

  return blogsData && blogsData.filter(blogData => !blogData.post_id).length > 1 && (
    <div className="blog navbar font-inter px-2 mb-4">
      <div className="navbar-inner w-full flex items-center justify-start overflow-x-scroll">
        {_.orderBy(blogsData.filter(blogData => !blogData.post_id), ['order'], ['asc']).map((blogData, i) => (
          <Link key={i} href={`/blog/${blogData.category_id}`}>
            <a className="btn btn-default bg-transparent hover:bg-blue-50 text-blue-700 hover:text-blue-800 my-2">
              {blogData.title || getName(blogData.category_id)}
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}