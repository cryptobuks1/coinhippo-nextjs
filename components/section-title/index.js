import PropTypes from 'prop-types'

const SectionTitle = ({ className = '', title, subtitle, right = null }) => {
  return (
    <div className="section-title w-full mb-6 pt-3">
      <div className={`flex flex-row ${className.includes(' items-') ? '' : 'items-center'} justify-between mb-4 ${className}`}>
        <div className="flex flex-col">
          <div className="uppercase text-gray-500 text-xs font-light">{title}</div>
          <div className="min-w-max text-xl font-semibold">{subtitle}</div>
        </div>
        {right}
      </div>
    </div>
  )
}

SectionTitle.propTypes = {
  className: PropTypes.any,
  title: PropTypes.any,
  subtitle: PropTypes.any,
  right: PropTypes.any,
}

export default SectionTitle