import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Projects from './projects'
import { Badge } from '../badges'
import { TiArrowRight } from 'react-icons/ti'
import { token, meta, list, funds } from '../../lib/api/subscan'
import { navigations } from '../../lib/menus'
import useMountedRef from '../../lib/mountedRef'
import { numberFormat } from '../../lib/utils'

const statuses = ['parachain', 'parathread', 'registered']

const Parachains = ({ navigationData, navigationItemData }) => {
  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { chain } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [tokenData, setTokenData] = useState(null)
  const [metaData, setMetaData] = useState(null)
  const [status, setStatus] = useState(statuses[0])
  const [parachainData, setParachainData] = useState(null)
  const [registeredData, setRegisteredData] = useState(null)
  const [projectsData, setProjectsData] = useState(null)

  const mountedRef = useMountedRef()

  useEffect(() => {
    const getToken = async () => {
      const response = await token({ chain })

      if (response) {
        if (mountedRef.current) {
          setTokenData({ data: response.data && response.data.detail && response.data.token && response.data.detail[response.data.token[0]], chain })
        }
      }
    }

    if (chain) {
      getToken()
    }
  }, [chain])

  useEffect(() => {
    const getMeta = async () => {
      const response = await meta({ chain })

      if (response) {
        if (mountedRef.current) {
          setMetaData({ data: response.data, chain })
        }
      }
    }

    if (chain) {
      getMeta()
    }
  }, [chain])

  useEffect(() => {
    const getList = async (_statuses, status_force) => {
      const _status = status_force || status

      const response = await list({ chain, order: !(['registered'].includes(_status)) ? 'para_id' : undefined, status: _statuses, row: 100, page: 0 })
    
      if (response) {
        if (_status === 'parachain') {
          if (mountedRef.current) {
            if (response.data && response.data.chains) {
              for (let i = 0; i < response.data.chains.length; i++) {
                const projectData = response.data.chains[i]

                if (projectData && projectData.fund_id) {
                  const fundsResponse = await funds({ chain, fund_id: projectData.fund_id, row: 100, page: 0 })

                  if (fundsResponse && fundsResponse.data && fundsResponse.data.funds && fundsResponse.data.funds[0]) {
                    const { balance, contributors, first_period, last_period } = { ...fundsResponse.data.funds[0] }

                    projectData.balance = balance
                    projectData.contributors = contributors
                    projectData.first_period = first_period
                    projectData.last_period = last_period

                    response.data.chains[i] = projectData
                  }
                }
              }
            }

            setParachainData({ data: response.data, chain })
          }
        }
        else if (_status === 'registered') {
          if (mountedRef.current) {
            setRegisteredData({ data: response.data, chain })
          }
        }

        if (!status_force) {
          if (mountedRef.current) {
            setProjectsData({ data: response.data, chain, status: _status })
          }
        }
      }
    }

    if (chain) {
      if (!registeredData) {
        getList(['Reserved'], 'registered')
      }

      getList(
        status === 'parathread' ?
          ['Onboarding', 'Parathread', 'UpgradingParathread', 'DowngradingToParathread'] :
        status === 'registered' ?
          ['Reserved'] :
          ['Parachain', 'DowngradingParachain', 'OffboardingParachain', 'UpgradingToParachain']
      )
    }
  }, [chain, status])

  if (!navigationData) {
    navigations.forEach(nav => {
      if (nav.url === '/parachains') navigationData = nav
      else if (nav.items) {
        nav.items.forEach(nav_1 => {
          if (nav_1.url === '/parachains') navigationData = nav_1
        })
      }
    })
  }

  if (typeof window !== 'undefined' && navigationData && navigationData.items && navigationData.items.findIndex(item => !item.isExternalUrl && !item.isComing) > -1 &&
    (['/[chain]'].findIndex(pathPattern => pathname.endsWith(pathPattern)) < 0 || (chain && navigationData.items.findIndex(item => item.url === _asPath && !item.isComing) < 0))) {
    router.push(navigationData.items[navigationData.items.findIndex(item => !item.isExternalUrl && !item.isComing)].url)
  }

  return (
    <div className="mx-1">
      <div className="w-full grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <span className="order-2 md:order-1 flex flex-wrap space-x-2">
          {metaData && metaData.data && metaData.chain === chain && statuses.map((_status, i) => (
            <Badge
              key={i}
              size="sm"
              rounded
              onClick={() => setStatus(_status)}
              color={`cursor-pointer border-0 ${_status === status ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:text-gray-100' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300'} font-medium space-x-1 py-1 px-1.5`}
            >
              <span className="capitalize">{_status}:</span>
              <span className="font-bold">
                {
                  _status === 'parachain' ?
                    <>
                      {typeof metaData.data.online_count === 'number' ?
                        numberFormat(metaData.data.online_count, '0,0')
                        :
                        '-'
                      }
                      {typeof metaData.data.total_slot_num === 'number' && (
                        <span>/{numberFormat(metaData.data.total_slot_num, '0,0')}</span>
                      )}
                    </> :
                  _status === 'parathread' ?
                    typeof metaData.data.upcoming_count === 'number' ?
                      numberFormat(metaData.data.upcoming_count, '0,0')
                      :
                      '-' :
                  _status === 'registered' ?
                    registeredData && registeredData.data && typeof registeredData.data.count === 'number' ?
                      numberFormat(registeredData.data.count, '0,0')
                      :
                      '-' :
                  null
                }
              </span>
            </Badge>
          ))}
        </span>
        <div className="order-1 md:order-2 flex flex-wrap justify-start md:justify-end space-x-2">
          {navigationItemData && navigationItemData.explorer && (
            <>
              {metaData && metaData.data && metaData.chain === chain && (
                <a href={`${navigationItemData.explorer.url}${navigationItemData.explorer.auction_path}`} target="_blank" rel="noopener noreferrer">
                  <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 px-1.5">
                    <span>Auction:</span>
                    <span className="font-bold">
                      {typeof metaData.data.auction_count === 'number' ?
                        numberFormat(metaData.data.auction_count, '0,0')
                        :
                        '-'
                      }
                    </span>
                  </Badge>
                </a>
              )}
              {parachainData && parachainData.data && parachainData.data.chains && (
                <a href={`${navigationItemData.explorer.url}${navigationItemData.explorer.auction_path}`} target="_blank" rel="noopener noreferrer">
                  <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium space-x-1 py-1 px-1.5">
                    <span>Current Lease:</span>
                    <span className="font-bold">
                      {parachainData.data.chains[0] && typeof parachainData.data.chains[0].first_period === 'number' ?
                        numberFormat(parachainData.data.chains[0].first_period, '0,0')
                        :
                        '-'
                      }
                    </span>
                  </Badge>
                </a>
              )}
              <a href={`${navigationItemData.explorer.url}`} target="_blank" rel="noopener noreferrer">
                <Badge size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium py-1 pl-1.5 pr-1">
                  <span>{navigationItemData.explorer.name}</span>
                  <TiArrowRight size={16} className="transform -rotate-45" />
                </Badge>
              </a>
            </>
          )}
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        <Projects
          navigationItemData={navigationItemData}
          projectsData={projectsData && projectsData.chain === chain && projectsData.status === status && projectsData.data && projectsData.data.chains}
          tokenData={tokenData && tokenData.chain === chain && tokenData.data}
          status={status}
        />
      </div>
    </div>
  )
}

Parachains.propTypes = {
  navigationData: PropTypes.any,
  navigationItemData: PropTypes.any,
}

export default Parachains