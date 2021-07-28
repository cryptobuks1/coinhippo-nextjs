import PropTypes from 'prop-types'

const Widget = ({ key = null, title = null, description = null, right = null, children }) => {
  return (
    <div className="widget w-full bg-white border border-gray-100 rounded-lg dark:bg-gray-900 dark:border-gray-800 p-4">
      {(title || description || right) && (
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="flex flex-col">
            <div className="text-gray-500 text-sm font-light">{title}</div>
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
  key: PropTypes.any,
  title: PropTypes.any,
  description: PropTypes.any,
  right: PropTypes.any,
  children: PropTypes.any,
}

export default Widget