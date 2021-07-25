import PropTypes from 'prop-types'

const SectionTitle = ({ title, subtitle, right = null }) => {
  return (
    <div className="section-title w-full mb-6 pt-3">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-col">
          <div className="uppercase text-gray-500 text-xs font-light">{title}</div>
          <div className="text-xl font-bold">{subtitle}</div>
        </div>
        {right}
      </div>
    </div>
  )
}

SectionTitle.propTypes = {
  title: PropTypes.any,
  subtitle: PropTypes.any,
  right: PropTypes.any,
}

export default SectionTitle