import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Pools from './pools'
import { Badge } from '../badges'
import Image from '../image'
import { FiBox } from 'react-icons/fi'
import { TiArrowRight } from 'react-icons/ti'
import _ from 'lodash'
import { dexStatus, dexEcosystem, dexPools } from '../../lib/api/covalent'
import { navigations, currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { numberFormat } from '../../lib/utils'

const Farm = ({ navigationData, navigationItemData }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { dex_name } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [statusData, setStatusData] = useState(null)
  const [ecosystemData, setEcosystemData] = useState(null)
  const [poolsData, setPoolsData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getStatus = async () => {
      const response = await dexStatus(navigationItemData.chain_id, dex_name)

      if (response && response.data && response.data.items) {
        if (mountedRef.current) {
          setStatusData({ data: { ...response.data.items[0] }, dex_name })
        }
      }
    }

    if (navigationItemData && dex_name) {
      getStatus()
    }
  }, [navigationItemData, dex_name])

  useEffect(() => {
    const getEcosystem = async () => {
      const response = await dexEcosystem(navigationItemData.chain_id, dex_name)

      if (response && response.data && response.data.items) {
        if (mountedRef.current) {
          setEcosystemData({ data: { ...response.data.items[0] }, dex_name })
        }
      }
    }

    if (navigationItemData && dex_name) {
      getEcosystem()
    }
  }, [navigationItemData, dex_name])

  useEffect(() => {
    const getPools = async () => {
      let data
      let page = 0
      let hasMore = true

      while (hasMore) {
        const response = await dexPools(navigationItemData.chain_id, dex_name, { 'page-number': page })

        if (response && response.data) {
          data = (
            _.uniqBy(_.concat(data || [], response.data.items), 'exchange')
            .map(poolData => {
              return {
                ...poolData,
                total_liquidity_quote: typeof poolData.total_liquidity_quote === 'string' ? Number(poolData.total_liquidity_quote) : typeof poolData.total_liquidity_quote === 'number' ? poolData.total_liquidity_quote : -1,
                volume_24h_quote: typeof poolData.volume_24h_quote === 'string' ? Number(poolData.volume_24h_quote) : typeof poolData.volume_24h_quote === 'number' ? poolData.volume_24h_quote : -1,
                fee_24h_quote: typeof poolData.fee_24h_quote === 'string' ? Number(poolData.fee_24h_quote) : typeof poolData.fee_24h_quote === 'number' ? poolData.fee_24h_quote : -1,
                annualized_fee: typeof poolData.annualized_fee === 'string' ? Number(poolData.annualized_fee) : typeof poolData.annualized_fee === 'number' ? poolData.annualized_fee : -1,
                pair: `${poolData.token_0.contract_ticker_symbol}-${poolData.token_1.contract_ticker_symbol}`,
              }
            })
          )

          hasMore = response.data.pagination && response.data.pagination.has_more
        }
        else {
          hasMore = false
        }

        page++

        hasMore = false
      }

      data = data || []

      if (data) {
        if (mountedRef.current) {
          setPoolsData({ data, dex_name })
        }
      }
    }

    if (navigationItemData && dex_name) {
      getPools()
    }
  }, [navigationItemData, dex_name])

  if (!navigationData) {
    navigations.forEach(nav => {
      if (nav.url === '/farm') navigationData = nav
      else if (nav.items) {
        nav.items.forEach(nav_1 => {
          if (nav_1.url === '/farm') navigationData = nav_1
        })
      }
    })
  }

  if (typeof window !== 'undefined' && navigationData && navigationData.items && navigationData.items[0] &&
    (['/[dex_name]'].findIndex(pathPattern => pathname.endsWith(pathPattern)) < 0 || (dex_name && navigationData.items.findIndex(item => item.url === _asPath) < 0))) {
    router.push(navigationData.items[0].url)
  }

  return (
    <div className="mx-1">
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        <span className="order-2 sm:order-1 lg:order-1 flex flex-wrap space-x-2">
          {ecosystemData && ecosystemData.data && ecosystemData.dex_name === dex_name && (
            <>
              <a href={`${navigationItemData.dex.analytic.url}${navigationItemData.dex.analytic.pairs_path}`} target="_blank" rel="noopener noreferrer">
                <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 px-1.5">
                  <span>Pairs:</span>
                  <span className="font-bold">
                    {typeof ecosystemData.data.total_active_pairs_7d === 'number' ?
                      numberFormat(ecosystemData.data.total_active_pairs_7d, '0,0')
                      :
                      '-'
                    }
                  </span>
                </Badge>
              </a>
              <a href={`${navigationItemData.dex.analytic.url}`} target="_blank" rel="noopener noreferrer">
                <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 px-1.5">
                  <span>Tx 24h:</span>
                  <span className="font-bold">
                    {typeof ecosystemData.data.total_swaps_24h === 'number' ?
                      numberFormat(ecosystemData.data.total_swaps_24h, '0,0')
                      :
                      '-'
                    }
                  </span>
                </Badge>
              </a>
              <a href={`${navigationItemData.dex.analytic.url}${navigationItemData.dex.analytic.fees_path}`} target="_blank" rel="noopener noreferrer">
                <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 px-1.5">
                  <span>Fees 24h:</span>
                  <span className="font-bold">
                    {typeof ecosystemData.data.total_fees_24h === 'number' ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(ecosystemData.data.total_fees_24h * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                  </span>
                </Badge>
              </a>
            </>
          )}
        </span>
        <span className="order-3 lg:order-2 flex flex-wrap lg:justify-center space-x-2">
          {ecosystemData && ecosystemData.data && ecosystemData.dex_name === dex_name && (
            <>
              <a href={`${navigationItemData.dex.analytic.url}`} target="_blank" rel="noopener noreferrer">
                <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 px-1.5">
                  <span>Liquidity:</span>
                  <span className="font-bold">
                    {ecosystemData.data.liquidity_chart_7d && _.last(ecosystemData.data.liquidity_chart_7d) && typeof _.last(ecosystemData.data.liquidity_chart_7d).liquidity_quote === 'number' ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(_.last(ecosystemData.data.liquidity_chart_7d).liquidity_quote * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                  </span>
                </Badge>
              </a>
              <a href={`${navigationItemData.dex.analytic.url}`} target="_blank" rel="noopener noreferrer">
                <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 px-1.5">
                  <span>Vol 24h:</span>
                  <span className="font-bold">
                    {ecosystemData.data.volume_chart_7d && _.last(ecosystemData.data.volume_chart_7d) && typeof _.last(ecosystemData.data.volume_chart_7d).volume_quote === 'number' ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(_.last(ecosystemData.data.volume_chart_7d).volume_quote * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                  </span>
                </Badge>
              </a>
            </>
          )}
        </span>
        <div className="order-1 sm:order-2 lg:order-3 flex flex-wrap justify-start sm:justify-end space-x-2">
          {ecosystemData && ecosystemData.data && ecosystemData.dex_name === dex_name && (
            <Link href={`/coin/${navigationItemData.gas.id}`}>
              <a target="_blank" rel="noopener noreferrer">
                <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 px-1.5">
                  <span className="font-bold">{navigationItemData.gas.symbol}:</span>
                  <span>
                    {typeof ecosystemData.data.gas_token_price_quote === 'number' ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(ecosystemData.data.gas_token_price_quote * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), '0,0.00000000')}</span>
                        {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                  </span>
                </Badge>
              </a>
            </Link>
          )}
          {statusData && statusData.data && statusData.dex_name === dex_name && (
            <a href={`${navigationItemData.explorer.url}${navigationItemData.explorer.block_path.replace('{block}', statusData.data.synced_block_height)}`} target="_blank" rel="noopener noreferrer">
              <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 pl-1 pr-1.5">
                <FiBox size={16} />
                <span>{numberFormat(statusData.data.synced_block_height, '0,0')}</span>
              </Badge>
            </a>
          )}
          {navigationItemData && navigationItemData.explorer && (
            <a href={`${navigationItemData.explorer.url}${navigationItemData.contract_address ? navigationItemData.explorer.contract_path.replace('{address}', navigationItemData.contract_address) : ''}`} target="_blank" rel="noopener noreferrer">
              <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium py-1 pl-1.5 pr-1">
                <span>{navigationItemData.explorer.name}</span>
                <TiArrowRight size={16} className="transform -rotate-45" />
              </Badge>
            </a>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center mt-8">
          <span className="text-lg font-semibold">Top {navigationItemData ? `${navigationItemData.currency_symbol.toUpperCase()} ` : ''}Pools</span>
          <span className="space-x-2 ml-0 md:ml-auto">
            {navigationItemData && navigationItemData.dex && (
              <>
                <a href={`${navigationItemData.dex.analytic.url}`} target="_blank" rel="noopener noreferrer">
                  <Badge size="sm" rounded color="bg-blue-500 hover:bg-blue-700 border-0 text-gray-100 hover:text-white font-semibold py-1 pl-1.5 pr-1">
                    <span className="capitalize">Analytics</span>
                    <TiArrowRight size={16} className="transform -rotate-45" />
                  </Badge>
                </a>
                <a href={`${navigationItemData.dex.exchange.url}`} target="_blank" rel="noopener noreferrer">
                  <Badge size="sm" rounded color="bg-blue-500 hover:bg-blue-700 border-0 text-gray-100 hover:text-white font-semibold py-1 pl-1.5 pr-1">
                    <span className="capitalize">Trade Now</span>
                    <TiArrowRight size={16} className="transform -rotate-45" />
                  </Badge>
                </a>
              </>
            )}
          </span>
        </div>
        <Pools
          navigationItemData={navigationItemData}
          poolsData={poolsData && poolsData.dex_name === dex_name && poolsData.data}
          ecosystemData={ecosystemData && ecosystemData.dex_name === dex_name && ecosystemData.data}
        />
      </div>
    </div>
  )
}

Farm.propTypes = {
  navigationData: PropTypes.any,
  navigationItemData: PropTypes.any,
}

export default Farm