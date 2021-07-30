import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import PublicCompanies from '../../components/public-companies'
import SectionTitle from '../../components/section-title'
import { navigation } from '../../lib/menus'
import { getName } from '../../lib/utils'

export default function PublicCompaniesCoin() {
  const { theme } = useSelector(state => ({ theme: state.theme }), shallowEqual)
  const { background } = { ...theme }

  const router = useRouter()
  const { query, asPath } = { ...router }
  const { coin_id } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  let navigationData, navigationItemData

  navigation.forEach(nav => {
    if (nav.url === '/public-companies') navigationData = nav
    else if (nav.items) {
      nav.items.forEach(nav_1 => {
        if (nav_1.url === '/public-companies') navigationData = nav_1
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
        title="Public Companies"
        subtitle={navigationItemData && navigationItemData.title ? navigationItemData.title : `${getName(coin_id)} Treasury`}
        right={navigationData && navigationData.items && (
          <div className="flex flex-wrap items-center ml-0 sm:ml-4 px-1">
            {navigationData.items.map((item, i) => (
              <Link key={i} href={item.url}>
                <a className={`btn btn-raised min-w-max btn-rounded flex items-center ${navigationItemData && item.url === navigationItemData.url ? 'bg-indigo-600 text-white' : `bg-transparent hover:bg-${background === 'dark' ? 'indigo-900 text-white hover:text-gray-200' : 'indigo-50 text-indigo-500 hover:text-indigo-600'}`} text-xs my-1 ${i < navigationData.items.length - 1 ? 'mr-2 md:mr-3' : ''} p-2`}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-4 h-4 rounded-full mr-1.5"
                    />
                  )}
                  {item.title}
                </a>
              </Link>
            ))}
          </div>
        )}
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      <PublicCompanies navigationData={navigationData} navigationItemData={navigationItemData} />
    </>
  )
}