import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Search from './search'
import NFTs from './nfts'
import Assets from './assets'
import { Badge } from '../badges'
import Image from '../image'
import { FiBox } from 'react-icons/fi'
import { TiArrowRight } from 'react-icons/ti'
import _ from 'lodash'
import { status, balances, pricing, nfts } from '../../lib/api/covalent'
import { navigations } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { generateUrl, numberFormat } from '../../lib/utils'

const nftPageSize = 4

const Wallet = ({ navigationData, navigationItemData }) => {
  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { chain_name, address, asset } = { ...query }
  const _asPath = (asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath).replace(`/${address}`, '')

  const [statusData, setStatusData] = useState(null)
  const [balancesData, setBalancesData] = useState(null)
  const [contractData, setContractData] = useState(null)
  const [nftPage, setNFTPage] = useState(0)
  const [nftLoading, setNFTLoading] = useState(false)
  const [nftHasMore, setNFTHasMore] = useState(true)

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
            _.orderBy(
              _.uniqBy(_.concat(data || [], response.data.items), 'contract_address')
              .map(balanceData => {
                return {
                  ...balanceData,
                  balance: typeof balanceData.balance === 'string' ? Number(balanceData.balance) : typeof balanceData.balance === 'number' ? balanceData.balance : -1,
                  quote_rate: typeof balanceData.quote_rate === 'string' ? Number(balanceData.quote_rate) : typeof balanceData.quote_rate === 'number' ? balanceData.quote_rate : -1,
                  quote: typeof balanceData.quote === 'string' ? Number(balanceData.quote) : typeof balanceData.quote === 'number' ? balanceData.quote : -1,
                  logo_url: !balanceData.logo_url && balanceData.contract_ticker_symbol.toLowerCase() === navigationItemData.currency_symbol ? navigationItemData.image : balanceData.logo_url,
                  nft_data: balanceData.nft_data && balanceData.nft_data.length > 0 && balanceData.nft_data,
                }
              }),
              [asset === 'nft' ? 'nft_data' : 'quote'], ['desc']
            )
          )

          hasMore = response.data.pagination && response.data.pagination.has_more
        }
        else {
          hasMore = false
        }

        page++
      }

      data = data || []

      if (data) {
        data = data.map(balanceData => {
          return {
            ...balanceData,
            port_share: balanceData.quote > -1 && balanceData.quote_rate > -1 ? balanceData.quote / _.sumBy(data.filter(_balanceData => _balanceData.quote > 0), 'quote') : -1,
          }
        })

        if (mountedRef.current) {
          setBalancesData({ data, chain_name, address })
        }
      }

      if (asset !== 'nft') {
        if (mountedRef.current) {
          setNFTPage(0)
          setNFTLoading(false)
          setNFTHasMore(true)
        }
      }
    }

    if (navigationItemData && address) {
      getBalances()
    }
  }, [navigationItemData, address, asset])

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

  useEffect(() => {
    const getNfts = async () => {
      if (mountedRef.current) {
        setNFTLoading(true)
      }

      const response = await nfts(navigationItemData.chain_id, address, { 'page-size': nftPageSize, 'page-number': nftPage })

      if (response && response.data) {
        if (mountedRef.current) {
          setBalancesData({
            data: _.uniqBy(_.concat((balancesData && balancesData.data) || [], response.data.items), 'token_id')
            .map(balanceData => {
              return {
                ...balanceData,
                nft_data: balanceData.nft_data && balanceData.nft_data.length > 0 && balanceData.nft_data,
              }
            }),
            chain_name,
            address,
          })

          setNFTHasMore(response.data.pagination && response.data.pagination.has_more ? true : false)
        }
      }

      if (mountedRef.current) {
        setNFTLoading(false)
      }
    }

    if (navigationItemData && address && contractData && contractData.address === address && contractData.data && asset === 'nft') {
      getNfts()
    }
  }, [navigationItemData, address, contractData, asset, nftPage])

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
          <NFTs
            balancesData={balancesData && balancesData.chain_name === chain_name && balancesData.address === address && balancesData.data && balancesData.data.filter(balanceData => balanceData.type === 'nft')}
            contractData={contractData && contractData.chain_name === chain_name && contractData.address === address && contractData.data}
            loading={nftLoading}
            hasMore={nftHasMore}
            pageSize={nftPageSize}
            onLoadMore={() => setNFTPage(nftPage + 1)}
          />
          :
          <Assets
            balancesData={balancesData && balancesData.chain_name === chain_name && balancesData.address === address && balancesData.data && balancesData.data.filter(balanceData => balanceData.type !== 'nft')}
            contractData={contractData && contractData.chain_name === chain_name && contractData.address === address && contractData.data}
          />
        :
        <div className="w-full flex flex-col justify-center">
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