import PropTypes from 'prop-types'

const Widget = ({ className = '', contentClassName = '', title = null, description = null, right = null, children }) => {
  return (
    <div className={`widget w-full bg-white border border-gray-100 rounded-lg dark:bg-gray-900 dark:border-gray-800 p-4 ${className}`}>
      {(title || description || right) && (
        <div className={`flex flex-row ${contentClassName.includes('items-') ? '' : 'items-center'} justify-between ${contentClassName}`}>
          <div className="w-full flex flex-col">
            <div className="text-gray-500 text-sm font-medium">{title}</div>
            <div className="text-sm font-semibold">{description}</div>
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  )
}

Widget.propTypes = {
  className: PropTypes.any,
  contentClassName: PropTypes.any,
  title: PropTypes.any,
  description: PropTypes.any,
  right: PropTypes.any,
  children: PropTypes.any,
}

export default Widget