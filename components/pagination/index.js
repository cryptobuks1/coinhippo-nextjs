import PropTypes from 'prop-types'
import { BsThreeDots } from 'react-icons/bs'

export const PageWithText = ({
  activeClassNames = 'btn btn-default bg-indigo-500 hover:bg-indigo-600 text-white',
  inactiveClassNames = 'btn btn-default bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
  children,
  active = false,
  onClick,
  disabled = false,
}) => {
  if (active) {
    return (
      <button disabled={disabled} onClick={onClick} className={activeClassNames}>
        {children}
      </button>
    )
  }
  return (
    <button disabled={disabled} onClick={onClick} className={inactiveClassNames}>
      {children}
    </button>
  )
}

export const Page = ({
  activeClassNames = 'btn btn-circle bg-indigo-600 hover:bg-indigo-500 text-white',
  inactiveClassNames = 'btn btn-circle bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white',
  children,
  active = false,
  onClick,
  disabled = false,
}) => {
  if (active) {
    return (
      <button disabled={disabled} onClick={onClick} className={activeClassNames}>
        {children}
      </button>
    )
  }
  return (
    <button disabled={disabled} onClick={onClick} className={inactiveClassNames}>
      {children}
    </button>
  )
}

export const Pages = ({ items = [], active, onClick, disabled = false }) => {
  const hide = i => items.length > 10 && [0, items.length - 1, active - 1].findIndex((_i, index) => Math.floor(Math.abs(i - _i)) < (index < 2 ? 3 : items.length < 20 ? 2 : 3)) < 0

  return (
    <>
      {items.map(i => hide(i) ?
        <div key={i} className={`${hide(i - 1) ? 'hidden' : ''}`}>
          <BsThreeDots size={20} className="text-gray-300 dark:text-gray-600 mt-1.5" />
        </div>
        :
        <Page key={i} disabled={disabled} active={i + 1 === active} onClick={() => onClick(i + 1)}>
          {i + 1}
        </Page>
      )}
    </>
  )
}

Pages.propTypes = {
  items: PropTypes.array.isRequired,
  active: PropTypes.number.isRequired,
  onClick: PropTypes.any,
  disabled: PropTypes.bool,
}

export const Pagination = ({
  items,
  active,
  previous = null,
  next = null,
  icons = false,
  onClick,
  disabled = false,
}) => {
  previous = active - 1 > 0 && previous
  next = active + 1 <= items.length && next

  if (icons) {
    return (
      <div className="pagination flex flex-wrap items-center justify-center space-x-2">
        {previous && <Page disabled={disabled} onClick={() => onClick(active - 1)}>{previous}</Page>}
        <Pages disabled={disabled} active={active} items={items} onClick={onClick} />
        {next && <Page disabled={disabled} onClick={() => onClick(active + 1)}>{next}</Page>}
      </div>
    )
  }
  return (
    <div className="pagination flex flex-wrap items-center justify-center space-x-2">
      {previous && <PageWithText disabled={disabled} onClick={() => onClick(active - 1)}>{previous}</PageWithText>}
      <Pages disabled={disabled} active={active} items={items} onClick={onClick} />
      {next && <PageWithText disabled={disabled} onClick={() => onClick(active + 1)}>{next}</PageWithText>}
    </div>
  )
}

Pagination.propTypes = {
  items: PropTypes.array.isRequired,
  active: PropTypes.number.isRequired,
  previous: PropTypes.any.isRequired,
  next: PropTypes.any.isRequired,
  icons: PropTypes.bool,
  onClick: PropTypes.any,
  disabled: PropTypes.bool,
}

export const PaginationLoadMore = ({
  item,
  active,
  icon = false,
  onClick,
  disabled = false,
}) => {
  if (icon) {
    return (
      <div className="pagination flex flex-wrap items-center justify-center">
        <Page disabled={disabled} active={active} onClick={onClick}>
          {item}
        </Page>
      </div>
    )
  }
  return (
    <div className="pagination flex flex-wrap items-center justify-center">
      <PageWithText disabled={disabled} active={active} onClick={onClick}>
        {item}
      </PageWithText>
    </div>
  )
}

PaginationLoadMore.propTypes = {
  item: PropTypes.string,
  active: PropTypes.bool,
  icon: PropTypes.bool,
  onClick: PropTypes.any,
  disabled: PropTypes.bool,
}