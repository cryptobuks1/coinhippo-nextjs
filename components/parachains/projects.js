import Datatable from '../datatable'
import CopyClipboard from '../copy-clipboard'
import Image from '../image'
import _ from 'lodash'
import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function Projects({ navigationItemData, projectsData, tokenData, status }) {
  return (
    <div className="my-4 lg:my-8 mx-auto">
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            sortType: (rowA, rowB) => rowA.original.i > rowB.original.i ? 1 : -1,
            Cell: props => (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                {!props.row.original.skeleton ?
                  props.value > -1 ?
                    numberFormat(props.value + 1, '0,0')
                    :
                    '-'
                  :
                  <div className="skeleton w-4 h-3 rounded" />
                }
              </div>
            ),
            headerClassName: 'justify-center',
          },
          {
            Header: 'Para ID',
            accessor: 'para_id',
            sortType: (rowA, rowB) => rowA.original.para_id > rowB.original.para_id ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                props.value ?
                  <a
                    href={navigationItemData ? `${navigationItemData.explorer.url}${navigationItemData.explorer.parachain_path.replace('{para_id}', props.value)}` : ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-medium"
                  >
                    <span>{props.value}</span>
                  </a>
                  :
                  '-'
                :
                <div className="skeleton w-10 h-4 rounded" />
            ),
            headerClassName: 'whitespace-nowrap',
          },
          {
            Header: 'Project',
            accessor: 'name',
            Cell: props => (
              !props.row.original.skeleton ?
                <a
                  href={navigationItemData ? `${navigationItemData.explorer.url}${navigationItemData.explorer.parachain_path.replace('{para_id}', props.row.original.para_id)}` : ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold"
                  style={{ minWidth: '10rem', maxWidth: '15rem' }}
                >
                  <div className="coin-column flex items-center space-x-2">
                    <Image
                      src={props.row.original.image}
                      alt=""
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <span className="space-x-1">
                      <span>{props.value || '-'}</span>
                      {props.row.original.symbol && (<span className={`uppercase text-gray-400 font-normal ${props.row.original.symbol.length > 6 ? 'break-all' : ''}`}>{props.row.original.symbol}</span>)}
                    </span>
                  </div>
                </a>
                :
                <div className="flex items-center">
                  <div className="skeleton w-7 h-7 rounded-full mr-2" />
                  <div className="skeleton w-20 h-4 rounded" />
                </div>
            ),
          },
          {
            Header: 'Fund ID',
            accessor: 'fund_id',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                props.value ?
                  <a
                    href={navigationItemData ? `${navigationItemData.explorer.url}${navigationItemData.explorer.fund_path.replace('{fund_id}', props.value)}` : ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-medium"
                  >
                    <span>{props.value}</span>
                  </a>
                  :
                  '-'
                :
                <div className="skeleton w-12 h-4 rounded" />
            ),
            headerClassName: 'whitespace-nowrap',
          },
          {
            Header: 'Fundraised',
            accessor: 'balance',
            sortType: (rowA, rowB) => Number(rowA.original.balance) > Number(rowB.original.balance) ? 1 : -1,
            Cell: props => (
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-right ml-auto mr-2">
                {!props.row.original.skeleton && tokenData ?
                  props.value ?
                    <>{numberFormat(Number(props.value) * Math.pow(10, -tokenData.token_decimals), '0,0')} {tokenData.symbol}</>
                    :
                    '-'
                  :
                  <div className="skeleton w-20 h-4 rounded ml-auto mr-2" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Contributors',
            accessor: 'contributors',
            sortType: (rowA, rowB) => rowA.original.contributors > rowB.original.contributors ? 1 : -1,
            Cell: props => (
              <div className="text-gray-900 dark:text-gray-100 font-semibold font-normal text-right ml-auto mr-2">
                {!props.row.original.skeleton && tokenData ?
                  typeof props.value === 'number' ?
                    numberFormat(props.value, '0,0')
                    :
                    '-'
                  :
                  <div className="skeleton w-20 h-4 rounded ml-auto mr-2" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'First Period',
            accessor: 'first_period',
            sortType: (rowA, rowB) => rowA.original.first_period > rowB.original.first_period ? 1 : -1,
            Cell: props => (
              <div className="text-gray-600 dark:text-gray-400 font-normal text-right ml-auto mr-2">
                {!props.row.original.skeleton ?
                  typeof props.value === 'number' ?
                    numberFormat(props.value, '0,0')
                    :
                    '-'
                  :
                  <div className="skeleton w-8 h-4 rounded ml-auto mr-2" />
                }
              </div>
            ),
            headerClassName: 'whitespace-nowrap justify-end text-right mr-2',
          },
          {
            Header: 'Last Period',
            accessor: 'last_period',
            sortType: (rowA, rowB) => rowA.original.last_period > rowB.original.last_period ? 1 : -1,
            Cell: props => (
              <div className="text-gray-600 dark:text-gray-400 font-normal text-right ml-auto mr-2">
                {!props.row.original.skeleton ?
                  typeof props.value === 'number' ?
                    numberFormat(props.value, '0,0')
                    :
                    '-'
                  :
                  <div className="skeleton w-8 h-4 rounded ml-auto mr-2" />
                }
              </div>
            ),
            headerClassName: 'whitespace-nowrap justify-end text-right mr-2',
          },
          {
            Header: 'Owner',
            accessor: 'manager_display',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div style={{ minWidth: '10rem' }}>
                  {props.value ?
                    props.value.display || props.value.parent ?
                      <a
                        href={navigationItemData ? `${navigationItemData.explorer.url}${navigationItemData.explorer.address_path.replace('{address}', (props.value.parent && props.value.parent.address) || props.value.address)}` : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-medium"
                      >
                        <span className="space-x-1">
                          {props.value.display && (
                            <span>{props.value.display}</span>
                          )}
                          {props.value.parent && (
                            <span>{Object.entries(props.value.parent).map(([key, value]) => ['display', 'sub_symbol'].includes(key) ? value : null).filter(s => s).join(' / ')}</span>
                          )}
                        </span>
                      </a>
                      :
                      null
                    :
                    '-'
                  }
                  {props.value && (
                    <div className="flex items-center text-gray-400 text-xs font-normal space-x-1">
                      <a
                        href={navigationItemData ? `${navigationItemData.explorer.url}${navigationItemData.explorer.address_path.replace('{address}', (props.value.parent && props.value.parent.address) || props.value.address)}` : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{ellipseAddress((props.value.parent && props.value.parent.address) || props.value.address, 6)}</span>
                      </a>
                      <CopyClipboard text={(props.value.parent && props.value.parent.address) || props.value.address} size={14} />
                    </div>
                  )}
                </div>
                :
                <div className="flex flex-col">
                  <div className="skeleton w-20 h-4 rounded" />
                  <div className="skeleton w-24 h-3 rounded mt-1" />
                </div>
            ),
          },
        ].filter(column => !((status === 'parathread' ? ['first_period', 'last_period', 'balance', 'contributors'] : status === 'registered' ? ['fund_id', 'first_period', 'last_period', 'balance', 'contributors'] : []).includes(column.accessor)))}
        data={projectsData ? projectsData.map((projectData, i) => { return { ...projectData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
        defaultPageSize={10}
        pagination={(!projectsData || projectsData.length <= 10) && (<></>)}
      />
    </div>
  )
}