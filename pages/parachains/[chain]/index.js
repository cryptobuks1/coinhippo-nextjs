import Link from 'next/link'
import { useRouter } from 'next/router'
import Parachains from '../../../components/parachains'
import SectionTitle from '../../../components/section-title'
import Image from '../../../components/image'
import { navigations } from '../../../lib/menus'
import { getName } from '../../../lib/utils'

export default function ParachainsIndex() {
  const router = useRouter()
  const { query, asPath } = { ...router }
  const { chain } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  let navigationData, navigationItemData

  navigations.forEach(nav => {
    if (nav.url === '/parachains') navigationData = nav
    else if (nav.items) {
      nav.items.forEach(nav_1 => {
        if (nav_1.url === '/parachains') navigationData = nav_1
      })
    }

    if (nav.url === _asPath) navigationItemData = nav
    else if (nav.items) {
      nav.items.forEach(nav_1 => {
        if (nav_1.url === _asPath) navigationItemData = nav_1
        else if (nav_1.items) {
          nav_1.items.forEach(nav_2 => {
            if (nav_2.url === _asPath) navigationItemData = nav_2
          })
        }
      })
    }
  })

  return (
    <>
      <SectionTitle
        title="Parachains"
        subtitle={navigationItemData ?
          <a href={navigationItemData.explorer.url} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center space-x-2 mt-1.5">
              {navigationItemData.image && (
                <Image
                  src={navigationItemData.image}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded"
                />
              )}
              <span>{navigationItemData.title}</span>
            </div>
          </a>
          :
          getName(chain)
        }
        right={navigationData && navigationData.items && (
          <div className="flex flex-wrap items-center ml-0 sm:ml-4 pr-1">
            {navigationData.items.map((item, i) => (
              item.isComing ?
                <button key={i} className={`btn btn-raised min-w-max btn-rounded bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed flex items-center text-xs space-x-1.5 my-1 ${i < navigationData.items.length - 1 ? 'mr-2 md:mr-3' : ''} p-2`}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      width={16}
                      height={16}
                      className="rounded"
                    />
                  )}
                  <span>{item.title}</span>
                </button>
                :
                <Link key={i} href={item.url}>
                  <a target={item.isExternalUrl ? '_blank' : '_self'} rel={item.isExternalUrl ? 'noopener noreferrer' : ''} className={`btn btn-raised min-w-max btn-rounded flex items-center ${navigationItemData && item.url === navigationItemData.url ? 'bg-indigo-600 text-white' : 'bg-transparent hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:text-white dark:hover:text-gray-200'} text-xs space-x-1.5 my-1 ${i < navigationData.items.length - 1 ? 'mr-2 md:mr-3' : ''} p-2`}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt=""
                        width={16}
                        height={16}
                        className="rounded"
                      />
                    )}
                    <span>{item.title}</span>
                  </a>
                </Link>
            ))}
          </div>
        )}
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      <Parachains navigationData={navigationData} navigationItemData={navigationItemData} />
    </>
  )
}