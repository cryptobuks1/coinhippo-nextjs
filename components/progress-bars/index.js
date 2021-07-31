import PropTypes from 'prop-types'

export const ProgressBar = ({ width, color, className = '' }) => {
  return (
    <div className="w-full h-1 relative flex flex-row items-center text-xs text-center">
      <div className={`w-full h-1 top-0 left-0 ${color} ${className}`} style={{ width: `${width}%` }} />
    </div>
  )
}

ProgressBar.propTypes = {
  width: PropTypes.number.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
}

export const ProgressBarWithText = ({ width, color, text, className = '' }) => {
  return (
    <div className="w-full h-4 bg-gray-50 dark:bg-gray-800 relative flex flex-row items-center text-xs text-center">
      <div className={`w-full absolute top-0 text-white ${color} ${className}`} style={{ width: `${width}%` }}>
        {text || `${width}%`}
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  width: PropTypes.number.isRequired,
  color: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
}