import { useEffect, forwardRef, useRef } from 'react'
import { PageWithText } from '../pagination'
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <input
      ref={resolvedRef}
      type="checkbox"
      {...rest}
      className="form-checkbox w-4 h-4"
    />
  )
})

export default function Datatable({ columns, data, rowSelectEnable, defaultPageSize, className = '' }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: defaultPageSize || 10 }
    },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        rowSelectEnable ? {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox { ...getToggleAllRowsSelectedProps() } />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox { ...row.getToggleRowSelectedProps() } />
          )
        } : undefined,
        ...columns
      ].filter(column => column))
    }
  )

  return (
    <>
      <table { ...getTableProps() } className={`table ${className}`}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr { ...headerGroup.getHeaderGroupProps() }>
              {headerGroup.headers.map(column => (
                <th { ...column.getHeaderProps(column.getSortByToggleProps()) } className="dark:bg-transparent">
                  <div className="flex flex-row items-center justify-start">
                    <span>{column.render('Header')}</span>
                    <span className="ml-auto">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FiChevronDown className="stroke-current text-2xs" />
                        ) : (
                          <FiChevronUp className="stroke-current text-2xs" />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody { ...getTableBodyProps() }>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr { ...row.getRowProps() }>
                {row.cells.map(cell => (<td { ...cell.getCellProps() }>{cell.render('Cell')}</td>))}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex flex-col sm:flex-row items-center justify-between my-4">
        <div className="pagination flex flex-wrap items-center justify-start">
          {pageIndex !== 0 && (
            <PageWithText onClick={() => gotoPage(0)}>First</PageWithText>
          )}
          {canPreviousPage && (
            <PageWithText onClick={() => previousPage()}>Previous</PageWithText>
          )}
          {canNextPage && (
            <PageWithText disabled={!canNextPage} onClick={() => nextPage()}>Next</PageWithText>
          )}
          {pageIndex !== pageCount - 1 && (
            <PageWithText disabled={!canNextPage} onClick={() => gotoPage(pageCount - 1)}>Last</PageWithText>
          )}
        </div>

        <span className="my-2 sm:my-0">
          Page <span className="font-bold">{pageIndex + 1}</span> of <span className="font-bold">{pageOptions.length}</span>
        </span>

        <select
          className="form-select dark:bg-gray-800 outline-none dark:border-gray-800 shadow-none focus:shadow-none text-xs"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}>
          {[10, 25, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}