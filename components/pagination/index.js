import PropTypes from 'prop-types'

export const PageWithText = ({
  activeClassNames = 'btn btn-default bg-indigo-500 hover:bg-indigo-600 text-white',
  inactiveClassNames = 'btn btn-default bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
  children,
  active = false,
  onClick
}) => {
  if (active) {
    return (
      <button onClick={onClick} className={activeClassNames}>
        {children}
      </button>
    )
  }
  return (
    <button onClick={onClick} className={inactiveClassNames}>
      {children}
    </button>
  )
}

export const Page = ({
  activeClassNames = 'btn btn-circle bg-indigo-600 hover:bg-indigo-500 text-white',
  inactiveClassNames = 'btn btn-circle bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white',
  children,
  active = false,
  onClick
}) => {
  if (active) {
    return (
      <button onClick={onClick} className={activeClassNames}>
        {children}
      </button>
    )
  }
  return (
    <button onClick={onClick} className={inactiveClassNames}>
      {children}
    </button>
  )
}

export const Pages = ({ items, active, onClick }) => (
  <>
    {items.map(i => (
      <Page key={i} onClick={() => onClick(i + 1)} active={i + 1 === active}>
        {i + 1}
      </Page>
    ))}
  </>
)

Pages.propTypes = {
  items: PropTypes.array.isRequired,
  active: PropTypes.number.isRequired,
}

export const Pagination = ({
  items,
  active,
  previous = null,
  next = null,
  icons = false,
  onClick
}) => {
  if (icons) {
    return (
      <div className="pagination flex flex-wrap items-center justify-start space-x-2">
        {previous && <Page onClick={() => onClick(active - 1)}>{previous}</Page>}
        <Pages active={active} items={items} onClick={onClick} />
        {next && <Page onClick={() => onClick(active + 1)}>{next}</Page>}
      </div>
    )
  }
  return (
    <div className="pagination flex flex-wrap items-center justify-start space-x-2">
      {previous && <PageWithText onClick={() => onClick(active - 1)}>{previous}</PageWithText>}
      <Pages active={active} items={items} onClick={onClick} />
      {next && <PageWithText onClick={() => onClick(active + 1)}>{next}</PageWithText>}
    </div>
  )
}

Pagination.propTypes = {
  items: PropTypes.array.isRequired,
  active: PropTypes.number.isRequired,
  previous: PropTypes.any.isRequired,
  next: PropTypes.any.isRequired,
  icons: PropTypes.bool,
}