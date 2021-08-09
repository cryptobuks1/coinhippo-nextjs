import Link from 'next/link'
import { useRouter } from 'next/router'
import Exchanges from '../../components/exchanges'
import SectionTitle from '../../components/section-title'
import Image from '../../components/image'
import { navigation } from '../../lib/menus'
import { generateUrl, getName } from '../../lib/utils'

export default function ExchangeType() {
  const router = useRouter()
  const { query, asPath } = { ...router }
  const { exchange_type } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  let navigationData, navigationItemData

  navigation.forEach(nav => {
    if (nav.url === '/exchanges') navigationData = nav
    else if (nav.items) {
      nav.items.forEach(nav_1 => {
        if (nav_1.url === '/exchanges') navigationData = nav_1
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
        title="Top Exchanges by Trading Volume"
        subtitle={navigationItemData && navigationItemData.title ? navigationItemData.title : getName(exchange_type)}
        right={navigationData && navigationData.items && (
          <div className="flex flex-wrap items-center ml-0 sm:ml-4 pr-1">
            {navigationData.items.map((item, i) => (
              <Link key={i} href={generateUrl(item.url, query, ['exchange_type'])}>
                <a className={`btn btn-raised min-w-max btn-rounded flex items-center ${navigationItemData && item.url === navigationItemData.url ? 'bg-indigo-600 text-white' : 'bg-transparent hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:text-white dark:hover:text-gray-200'} text-xs space-x-1.5 my-1 ${i < navigationData.items.length - 1 ? 'mr-2 md:mr-3' : ''} p-2`}>
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
      <Exchanges navigationData={navigationData} navigationItemData={navigationItemData} />
    </>
  )
}