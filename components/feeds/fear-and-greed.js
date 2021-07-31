import PropTypes from 'prop-types'
import { ProgressBarWithText } from '../progress-bars'
import { FaRegGrinSquintTears, FaRegGrinSquint, FaRegGrinBeamSweat, FaRegGrin, FaRegGrinWink, FaRegGrinBeam, FaRegGrinStars } from 'react-icons/fa'

const FearAndGreed = ({ data = null }) => {
  let color, icon

  if (data) {
    data.value = Number(data.value)

    color = data.value <= data.low_threshold ? 'red-600' :
      data.value >= data.high_threshold ? 'green-500' :
      data.value < 50 ?
        data.value <= (50 - data.low_threshold) / 2 ? 'red-500' : 'yellow-600' :
        data.value > 50 ? data.value >= 50 + ((data.high_threshold - 50) / 2) ? 'green-400' : 'yellow-400' :
      'yellow-500'

    icon = data.value <= data.low_threshold ? <FaRegGrinSquintTears size={24} /> :
      data.value >= data.high_threshold ? <FaRegGrinStars size={24} /> :
      data.value < 50 ?
        data.value <= (50 - data.low_threshold) / 2 ? <FaRegGrinSquint size={24} /> : <FaRegGrinBeamSweat size={24} /> :
        data.value > 50 ? data.value >= 50 + ((data.high_threshold - 50) / 2) ? <FaRegGrinBeam size={24} /> : <FaRegGrinWink size={24} /> :
      <FaRegGrin size={24} />
  }

  return data && (
    <>
      <div className={`flex items-center text-${color}`}>
        <span className="text-base font-medium mr-2">{data.value_classification}</span>
        <span className="ml-auto">{icon}</span>
      </div>
      <div className="my-1.5">
        <ProgressBarWithText width={data.value} color={`bg-${color}`} />
      </div>
    </>
  )
}

FearAndGreed.propTypes = {
  data: PropTypes.any,
}

export default FearAndGreed