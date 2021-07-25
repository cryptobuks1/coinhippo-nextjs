import Link from 'next/link'
import { useRouter } from 'next/router'
import _ from 'lodash'
import { getName } from '../../lib/utils'

export default function Header({ blogsData }) {
  const router = useRouter()
  const { query } = { ...router }
  const { category_id, post_id } = { ...query }

  return blogsData && (
    <div className="border-t py-6 lg:py-12">
      {!post_id ?
        blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id && blogData.post_id !== post_id).length > 0 && (
          <>
            <div className="text-2xl lg:text-3xl font-bold my-4">{blogsData.findIndex(blogData => blogData.category_id === category_id && !blogData.post_id && blogData.title) > -1 ? `📖 All ${blogsData[blogsData.findIndex(blogData => blogData.category_id === category_id && !blogData.post_id && blogData.title)].title}` : 'Related Topics:'}</div>
            {_.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id && blogData.post_id !== post_id), ['order'], ['asc']).map((blogData, i) => (
              <div key={i} className="text-blue-700 text-xl lg:text-2xl font-semibold mt-6">
                <div className="text-gray-500 text-sm font-normal mb-1">Chapter {blogData.order}</div>
                <a href={`/blog/${blogData.category_id}/${blogData.post_id}`}>{blogData.title || (blogData.meta && blogData.meta.title) || getName(blogData.post_id)}</a>
              </div>
            ))}
          </>
        )
        :
        <>
          {_.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id), ['order'], ['asc']).findIndex(blogData => blogData.post_id === post_id) + 1 < blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id).length && (
            <>
              <div className="text-2xl lg:text-3xl font-bold my-4">{"Next"}</div>
              {[_.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id), ['order'], ['asc'])[_.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id), ['order'], ['asc']).findIndex(blogData => blogData.post_id === post_id) + 1]].map((blogData, i) => (
                <div key={i} className="text-blue-700 text-xl lg:text-2xl font-semibold mt-6">
                  <div className="text-gray-500 text-sm font-normal mb-1">Chapter {blogData.order}</div>
                  <a href={`/blog/${blogData.category_id}/${blogData.post_id}`}>{blogData.title || (blogData.meta && blogData.meta.title) || getName(blogData.post_id)}</a>
                </div>
              ))}
            </>
          )}
          {_.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id), ['order'], ['asc']).findIndex(blogData => blogData.post_id === post_id) - 1 > -1 && _.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id), ['order'], ['asc']).findIndex(blogData => blogData.post_id === post_id) + 1 < blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id).length && (
            <div className="py-4" />
          )}
          {_.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id), ['order'], ['asc']).findIndex(blogData => blogData.post_id === post_id) - 1 > -1 && (
            <>
              <div className="text-2xl lg:text-3xl font-bold my-4">{"Previous"}</div>
              {[_.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id), ['order'], ['asc'])[_.orderBy(blogsData.filter(blogData => blogData.category_id === category_id && blogData.post_id), ['order'], ['asc']).findIndex(blogData => blogData.post_id === post_id) - 1]].map((blogData, i) => (
                <div key={i} className="text-blue-700 text-xl lg:text-2xl font-semibold mt-6">
                  <div className="text-gray-500 text-sm font-normal mb-1">Chapter {blogData.order}</div>
                  <a href={`/blog/${blogData.category_id}/${blogData.post_id}`}>{blogData.title || (blogData.meta && blogData.meta.title) || getName(blogData.post_id)}</a>
                </div>
              ))}
            </>
          )}
        </>
      }
    </div>
  )
}