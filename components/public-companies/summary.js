import PropTypes from 'prop-types'
import Widget from '../widget'
import { BiBuildings, BiDollarCircle } from 'react-icons/bi'
import { AiOutlinePieChart } from 'react-icons/ai'
import _ from 'lodash'
import { numberFormat } from '../../lib/utils'

const Summary = ({ data, navigationItemData }) => {
  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 md:mb-4">
      <Widget
        title={<span className="uppercase">Companies</span>}
        description={<span className="text-xl">
          {data ?
            numberFormat(data.companies && data.companies.length, '0,0')
            :
            <div className="skeleton w-8 h-6 rounded mt-1" />
          }
        </span>}
        right={<BiBuildings size={32} className="stroke-current text-gray-500 dark:text-gray-400" />}
      />
      <Widget
        title={<span className="uppercase">Total Holdings</span>}
        description={<span className="text-xl">
          {data ?
            <>
              {numberFormat(data.total_holdings, '0,0')}
              {navigationItemData && navigationItemData.symbol && (<>&nbsp;{navigationItemData.symbol.toUpperCase()}</>)}
            </>
            :
            <div className="skeleton w-24 h-6 rounded mt-1" />
          }
        </span>}
        right={navigationItemData && navigationItemData.image && (
          <img
            src={navigationItemData.image}
            alt=""
            className="w-8 h-8 rounded"
          />
        )}
      />
      <Widget
        title={<span className="uppercase">Total Value</span>}
        description={<span className="text-xl">
          {data ?
            <>${numberFormat(data.total_value_usd, '0,0')}</>
            :
            <div className="skeleton w-36 h-6 rounded mt-1" />
          }
        </span>}
        right={<BiDollarCircle size={32} className="stroke-current text-gray-500 dark:text-gray-400" />}
      />
      <Widget
        title={<span className="uppercase">Dominance</span>}
        description={<span className="text-xl">
          {data ?
            <>{numberFormat(data.market_cap_dominance || _.sumBy(data.companies, 'percentage_of_total_supply'), '0,0.00')}%</>
            :
            <div className="skeleton w-12 h-6 rounded mt-1" />
          }
        </span>}
        right={<AiOutlinePieChart size={32} className="stroke-current text-gray-500 dark:text-gray-400" />}
      />
    </div>
  )
}

Summary.propTypes = {
  data: PropTypes.any,
  navigationItemData: PropTypes.any,
}

export default Summary