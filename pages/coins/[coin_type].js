import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import DropdownCategory from '../../components/coins/dropdown-category'
import Coins from '../../components/coins'
import SectionTitle from '../../components/section-title'
import Image from '../../components/image'
import { navigation } from '../../lib/menus'
import { getName } from '../../lib/utils'

export default function CoinType() {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { all_crypto_data } = { ...data }

  const router = useRouter()
  const { query, asPath } = { ...router }
  const { coin_type } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  let navigationData, navigationItemData

  navigation.forEach(nav => {
    if (nav.url === '/coins/categories') navigationData = nav
    else if (nav.items) {
      nav.items.forEach(nav_1 => {
        if (nav_1.url === '/coins/categories') navigationData = nav_1
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

  const othersCategories = all_crypto_data && all_crypto_data.categories && all_crypto_data.categories.filter(categoryData =>
    categoryData.category_id && !(navigationData && navigationData.items && navigationData.items.findIndex(item => item.url === `/coins/${categoryData.category_id}`) > -1)
  )

  return (
    <>
      <SectionTitle
        title="Top Cryptocurrency Prices by Market Capitalization"
        subtitle={navigationItemData && navigationItemData.title ? navigationItemData.title : othersCategories && othersCategories.findIndex(categoryData => categoryData.category_id === coin_type && categoryData.name) > -1 ? othersCategories[othersCategories.findIndex(categoryData => categoryData.category_id === coin_type)].name : getName(coin_type)}
        right={
          <>
            {navigationData && navigationData.items && (
              <div className="flex flex-wrap items-center ml-0 sm:ml-4 pr-1">
                {navigationData.items.map((item, i) => (
                  <Link key={i} href={item.url}>
                    <a className={`btn btn-raised min-w-max btn-rounded flex items-center ${navigationItemData && item.url === navigationItemData.url ? 'bg-indigo-600 text-white' : 'bg-transparent hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:text-white dark:hover:text-gray-200'} text-xs space-x-1.5 my-1 ${i < navigationData.items.length - 1 ? 'mr-2 md:mr-3' : 'mr-2 md:mr-3'} p-2`}>
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
                {othersCategories && othersCategories.length > 0 && (
                  <DropdownCategory data={othersCategories} navigationItemData={navigationItemData} />
                )}
              </div>
            )}
          </>
        }
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      <Coins navigationData={navigationData} />
    </>
  )
}