import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Search from './search'
import NFT from './nft'
import Asset from './asset'
import { Badge } from '../../components/badges'
import Image from '../../components/image'
import { FiBox } from 'react-icons/fi'
import { TiArrowRight } from 'react-icons/ti'
import _ from 'lodash'
import { status, balances, pricing } from '../../lib/api/covalent'
import { navigations, currencies } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { generateUrl, numberFormat } from '../../lib/utils'

const Wallet = ({ navigationData, navigationItemData }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { chain_name, address, asset } = { ...query }
  const _asPath = (asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath).replace(`/${address}`, '')

  const [statusData, setStatusData] = useState(null)
  const [balancesData, setBalancesData] = useState(null)
  const [contractData, setContractData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getStatus = async () => {
      const response = await status()

      if (response && response.data && response.data.items) {
        if (mountedRef.current) {
          setStatusData({ data: { ...response.data.items[response.data.items.findIndex(item => item.name === chain_name)] }, chain_name })
        }
      }
    }

    if (chain_name && !address) {
      getStatus()
    }
  }, [chain_name, address])

  useEffect(() => {
    const getBalances = async () => {
      let data
      let page = 0
      let hasMore = true

      while (hasMore) {
        const response = await balances(navigationItemData.chain_id, address, { nft: true, 'page-number': page })

        if (response && response.data) {
          data = (
            _.uniqBy(_.concat(data || [], response.data.items), 'contract_address')
            .map(balanceData => {
              return {
                ...balanceData,
                balance: typeof balanceData.balance === 'string' ? Number(balanceData.balance) : typeof balanceData.balance === 'number' ? balanceData.balance : -1,
                nft_data: balanceData.nft_data && balanceData.nft_data.length > 0 && balanceData.nft_data,
              }
            })
          )

          hasMore = response.data.pagination && response.data.pagination.has_more
        }
        else {
          hasMore = false
        }

        page++
      }

      if (data) {
        if (mountedRef.current) {
          setBalancesData({ data, chain_name, address })
        }
      }
    }

    if (navigationItemData && address) {
      getBalances()
    }
  }, [navigationItemData, address])

  useEffect(() => {
    const getPricing = async () => {
      const response = await pricing(navigationItemData.chain_id, address)

      if (response && response.data) {
        if (mountedRef.current) {
          setContractData({ data: { ...response.data[0] }, chain_name, address })
        }
      }
    }

    if (navigationItemData && address) {
      getPricing()
    }
  }, [navigationItemData, address])

  if (!navigationData) {
    navigations.forEach(nav => {
      if (nav.url === '/wallet') navigationData = nav
      else if (nav.items) {
        nav.items.forEach(nav_1 => {
          if (nav_1.url === '/wallet') navigationData = nav_1
        })
      }
    })
  }

  if (typeof window !== 'undefined' && navigationData && navigationData.items && navigationData.items[0] &&
    (['/[chain_name]', '/[address]'].findIndex(pathPattern => pathname.endsWith(pathPattern)) < 0 || (chain_name && navigationData.items.findIndex(item => item.url === _asPath) < 0))) {
    router.push(navigationData.items[0].url)
  }

  return (
    <div className="mx-1">
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
        <span className="order-3 md:order-1 flex">
          {address && ['asset', 'nft'].map((item, i) => (
            <Link key={i} href={generateUrl(`${_asPath}/${address}`, item === 'asset' ? null : { asset: item })}>
              <a className={`h-8 btn btn-raised min-w-max btn-rounded ${(!asset && item === 'asset') || item === asset ? 'bg-indigo-600 text-white' : 'bg-transparent hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:text-white dark:hover:text-gray-200'} text-xs ${i < navigationData.items.length - 1 ? 'mr-2' : ''} p-2`}>
                <span className="uppercase">{item}</span>
              </a>
            </Link>
          ))}
        </span>
        <span className="order-2 sm:order-1 flex md:justify-center">
          <Search />
        </span>
        <div className="order-1 sm:order-2 md:order-3 flex justify-start sm:justify-end space-x-2">
          {!address && statusData && statusData.data && statusData.chain_name === chain_name && (
            <a href={`${navigationItemData.explorer.url}${navigationItemData.explorer.block_path.replace('{block}', statusData.data.synced_block_height)}`} target="_blank" rel="noopener noreferrer">
              <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 pl-1 pr-1.5">
                <FiBox size={16} />
                <span>{numberFormat(statusData.data.synced_block_height, '0,0')}</span>
              </Badge>
            </a>
          )}
          {navigationItemData && navigationItemData.explorer && (
            <a href={`${navigationItemData.explorer.url}${address ? (contractData && contractData.data && contractData.address === address ? navigationItemData.explorer.contract_path : navigationItemData.explorer.address_path).replace('{address}', address) : ''}`} target="_blank" rel="noopener noreferrer">
              <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium py-1 pl-1.5 pr-1">
                <span>{navigationItemData.explorer.name}</span>
                <TiArrowRight size={16} className="transform -rotate-45" />
              </Badge>
            </a>
          )}
        </div>
      </div>
      {pathname.endsWith('/[address]') ?
        asset === 'nft' ?
          <NFT />
          :
          <Asset />
        :
        <div className="flex flex-col justify-center">
          <img
            src={navigationItemData && navigationItemData.image}
            alt=""
            className="w-auto h-40 lg:h-64 object-contain mt-4 md:mt-8 lg:mt-16"
          />
          <span className="uppercase text-gray-800 dark:text-gray-200 text-lg font-semibold mt-4 md:mt-8 mx-auto">
            {chain_name}
          </span>
          <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm space-x-1 mt-2 mx-auto">
            <span>Data taken from</span>
            <a href="https://covalenthq.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
              <Image
                src="/logos/api/covalent.png"
                alt=""
                width={24}
                height={24}
              />
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Covalent</span>
            </a>
          </span>
        </div>
      }
    </div>
  )
}

Wallet.propTypes = {
  navigationData: PropTypes.any,
  navigationItemData: PropTypes.any,
}

export default Wallet