import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Header from './header'
import Footer from './footer'
import { Badge } from '../../components/badges'
import { FaTwitter, FaTelegram, FaWhatsapp } from 'react-icons/fa'
import parse from 'html-react-parser'
import Linkify from 'react-linkify'
import Blogs from '../../lib/api/blog'
import meta from '../../lib/meta'
import useMountedRef from '../../lib/mountedRef'

export default function Blog() {
  const router = useRouter()
  const { query, asPath } = { ...router }
  const { category_id, post_id } = { ...query }

  const [blogsData, setBlogsData] = useState(null)
  const [blogData, setBlogData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getBlogs = async () => {
      const response = await Blogs()

      if (response) {
        if (mountedRef.current) {
          setBlogsData(response)
        }
      }
    }

    getBlogs()
  }, [])

  useEffect(() => {
    const getBlog = async () => {
      const response = await Blogs({ category_id, post_id, include_html: true })

      if (response) {
        if (mountedRef.current) {
          setBlogData(response)
        }
      }
      else {
        router.push('/blog')
      }
    }

    if (category_id) {
      getBlog()
    }
  }, [category_id, post_id])

  if (!category_id && blogsData && _.orderBy(blogsData.filter(blog => !blog.post_id), ['order'], ['asc'])[0]) {
    router.push(`/blog/${_.orderBy(blogsData.filter(blog => !blog.post_id), ['order'], ['asc'])[0].category_id}`)
  }

  const headMeta = meta(asPath, blogData)

  return blogData && (
    <>
      <Head>
        <title>{headMeta.title}</title>
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
      <Header blogsData={blogsData} />
      <div className="blog w-full max-w-3xl font-inter mx-auto">
        {post_id && blogsData && blogsData.filter(blog => blog.category_id === category_id && !blog.post_id).map((blog, i) => (
          <div key={i} className="mt-4 pb-2">
            <a href={`/blog/${blog.category_id}`} className="text-blue-700 text-base font-semibold">{blog.title || blog.category_id}</a>
          </div>
        ))}
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mt-6 mb-8" style={{ lineHeight: 1.25 }}>{blogData.title}</h1>
        {post_id && (<div className="text-gray-500 text-base mt-6 lg:mt-12">Chapter {blogData.order}</div>)}
        <div className="flex items-center mt-4">
          <a href={`https://twitter.com/intent/tweet?original_referer=${process.env.NEXT_PUBLIC_SITE_URL}&text=${blogData.title}&url=${process.env.NEXT_PUBLIC_SITE_URL}/blog/${category_id}${post_id ? `/${post_id}` : ''}&via=${process.env.NEXT_PUBLIC_TWITTER_USERNAME}`} target="_blank" rel="noopener noreferrer" className="mr-2">
            <Badge rounded color="bg-blue-400 text-white">
              <FaTwitter size={16} className="mr-1" />
              Tweet
            </Badge>
          </a>
          <a href={`https://telegram.me/share/url?text=${blogData.title}&url=${process.env.NEXT_PUBLIC_SITE_URL}/blog/${category_id}${post_id ? `/${post_id}` : ''}`} target="_blank" rel="noopener noreferrer" className="mr-2">
            <Badge rounded color="bg-indigo-400 text-white">
              <FaTelegram size={16} className="mr-1" />
              Share
            </Badge>
          </a>
          <a href={`https://wa.me/?text=${process.env.NEXT_PUBLIC_SITE_URL}/blog/${category_id}${post_id ? `/${post_id}` : ''}`} target="_blank" rel="noopener noreferrer">
            <Badge rounded color="bg-green-400 text-white">
              <FaWhatsapp size={16} className="mr-1" />
              Share
            </Badge>
          </a>
        </div>
        <div className="text-lg font-normal mt-8 md:mt-12 mb-12 md:mb-16">
          {blogData.html && (<Linkify>{parse(blogData.html)}</Linkify>)}
        </div>
        <Footer blogsData={blogsData} />
      </div>
    </>
  )
}