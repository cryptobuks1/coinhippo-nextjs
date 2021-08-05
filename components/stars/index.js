import { FaStar, FaStarHalfAlt } from 'react-icons/fa'

export default function Stars({ score = 0, maxScore = 10, maxStar = 5, className = '' }) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(maxStar).keys()].map(i => score * maxStar / maxScore > i ?
        score * maxStar / maxScore < i + 1 ?
          <FaStarHalfAlt key={i} className="text-yellow-500 dark:text-yellow-300" />
          :
          <FaStar key={i} className="text-yellow-500 dark:text-yellow-300" />
        :
        <FaStar key={i} className="text-gray-200 dark:text-gray-700" />
      )}
    </div>
  )
}