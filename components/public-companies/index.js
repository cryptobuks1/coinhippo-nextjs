import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Summary from './summary'
import Datatable from '../../components/datatable'
import { Badge } from '../../components/badges'
import { ProgressBar } from '../../components/progress-bars'
import _ from 'lodash'
import { publicCompanies } from '../../lib/api/coingecko'
import { navigation } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { numberFormat } from '../../lib/utils'

const PublicCompanies = ({ navigationData, navigationItemData }) => {
  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { coin_id } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [treasuryData, setTreasuryData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getPublicCompanies = async () => {
      const response = await publicCompanies(coin_id)

      if (response) {
        if (mountedRef.current) {
          setTreasuryData({ ...response, coin_id })
        }
      }
    }

    if (coin_id) {
      getPublicCompanies()
    }
  }, [coin_id])

  if (!navigationData) {
    navigation.forEach(nav => {
      if (nav.url === '/public-companies') navigationData = nav
      else if (nav.items) {
        nav.items.forEach(nav_1 => {
          if (nav_1.url === '/public-companies') navigationData = nav_1
        })
      }
    })
  }

  if (typeof window !== 'undefined' && navigationData && navigationData.items && navigationData.items[0] &&
    (!pathname.endsWith('/[coin_id]') || (coin_id && navigationData.items.findIndex(item => item.url === _asPath) < 0))) {
    router.push(navigationData.items[0].url)
  }

  return (!treasuryData || coin_id === treasuryData.coin_id) && (
    <div className="mx-1">
      <Summary data={treasuryData} navigationItemData={navigationItemData} />
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            sortType: 'number',
            Cell: props => (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                {!props.row.original.skeleton ?
                  numberFormat(props.value + 1, '0,0')
                  :
                  <div className="skeleton w-4 h-3 rounded" />
                }
              </div>
            ),
            headerClassName: 'justify-center',
          },
          {
            Header: 'Company',
            accessor: 'name',
            Cell: props => (
              <div className="flex flex-col font-semibold">
                {!props.row.original.skeleton ?
                  <>
                    {props.value}
                    <span className="text-gray-400 text-xs font-normal">
                      <Badge size="sm" rounded color="bg-blue-500 text-gray-100 dark:bg-blue-700 mr-1.5">{props.row.original.country}</Badge>
                      {props.row.original.symbol}
                    </span>
                  </>
                  :
                  <div className="flex flex-col">
                    <div className="skeleton w-24 h-4 rounded" />
                    <span className="flex items-center mt-1">
                      <div className="skeleton w-8 h-3.5 rounded mr-1.5" />
                      <div className="skeleton w-16 h-3.5 rounded" />
                    </span>
                  </div>
                }
              </div>
            ),
          },
          {
            Header: 'Total Holdings',
            accessor: 'total_holdings',
            sortType: (rowA, rowB) => rowA.original.total_holdings > rowB.original.total_holdings ? 1 : -1,
            Cell: props => (
              <div className="text-indigo-700 dark:text-indigo-300 font-bold text-right space-x-1 mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  <>
                    <span>{numberFormat(props.value, '0,0')}</span>
                    {navigationItemData && (<span className="uppercase">{navigationItemData.symbol}</span>)}
                  </>
                  :
                  <div className="skeleton w-16 h-4 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
          {
            Header: 'Entry Value (USD)',
            accessor: 'total_entry_value_usd',
            sortType: (rowA, rowB) => rowA.original.total_entry_value_usd > rowB.original.total_entry_value_usd ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-medium text-right mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  <>
                    {props.value ? `$${numberFormat(props.value, '0,0')}` : '-'}
                    <span className="text-gray-400 text-xs font-normal">{props.value && props.row.original.total_holdings ? `~ $${numberFormat(props.value / props.row.original.total_holdings, '0,0')}${navigationItemData && navigationItemData.symbol ? ` / ${navigationItemData.symbol.toUpperCase()}` : ''}` : '-'}</span>
                  </>
                  :
                  <>
                    <div className="skeleton w-24 h-3.5 rounded ml-auto" />
                    <div className="skeleton w-20 h-3 rounded mt-1.5 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
          {
            Header: 'Current Value (USD)',
            accessor: 'total_current_value_usd',
            sortType: (rowA, rowB) => rowA.original.total_current_value_usd > rowB.original.total_current_value_usd ? 1 : -1,
            Cell: props => (
              <div className={`flex flex-col ${props.value && props.row.original.total_entry_value_usd ? props.value > props.row.original.total_entry_value_usd ? 'text-green-500' : props.value < props.row.original.total_entry_value_usd ? 'text-red-500' : 'text-gray-400' : ''} font-semibold text-right mr-2 lg:mr-4 xl:mr-8`}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value ? `$${numberFormat(props.value, '0,0')}` : '-'}
                    <span className="text-xs font-normal">{props.value && props.row.original.total_entry_value_usd ? `${numberFormat((props.value - props.row.original.total_entry_value_usd) * 100 / props.row.original.total_entry_value_usd, '+0,0.00')}%` : '-'}</span>
                  </>
                  :
                  <>
                    <div className="skeleton w-24 h-3.5 rounded ml-auto" />
                    <div className="skeleton w-12 h-3 rounded mt-1.5 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
          {
            Header: '% of Total Supply',
            accessor: 'percentage_of_total_supply',
            sortType: (rowA, rowB) => rowA.original.percentage_of_total_supply > rowB.original.percentage_of_total_supply ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-medium">
                {!props.row.original.skeleton ?
                  <>
                    <span>{props.value ? `${numberFormat(props.value, '0,0.000')}%` : '-'}</span>
                    <ProgressBar width={props.value * 100 / (treasuryData.market_cap_dominance || _.sumBy(treasuryData.companies, 'percentage_of_total_supply'))} color="bg-yellow-500" className="h-1" />
                  </>
                  :
                  <>
                    <div className="skeleton w-10 h-3 rounded" />
                    <div className={`skeleton w-${Math.floor((10 - props.row.original.i) / 3)}/12 h-1 rounded mt-1`} />
                  </>
                }
              </div>
            ),
          }
        ]}
        data={treasuryData ? treasuryData.companies.map((company, i) => { return { ...company, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
        className="striped"
      />
    </div>
  )
}

PublicCompanies.propTypes = {
  navigationData: PropTypes.any,
  navigationItemData: PropTypes.any,
}

export default PublicCompanies