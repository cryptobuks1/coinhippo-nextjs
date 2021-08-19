import { useState, useRef } from 'react'
import { usePopper } from 'react-popper'

export default function Tooltip({ placement, title, content, children }) {
  const [hidden, setHidden] = useState(true)

  const buttonRef = useRef(null)
  const tooltipRef = useRef(null)

  const { styles, attributes } = usePopper(
    buttonRef.current,
    tooltipRef.current,
    {
      placement,
      modifiers: [
        {
          name: 'offset',
          enabled: true,
          options: {
            offset: [0, 0]
          }
        }
      ]
    }
  )

  const showTooltip = () => setHidden(false)

  const hideTooltip = () => setHidden(true)

  return (
    <div className="hidden lg:flex">
      <button
        ref={buttonRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="btn btn-default btn-rounded"
        style={{ padding: 0 }}
      >
        {children}
      </button>
      <div ref={tooltipRef} { ...attributes.popper } style={styles.popper}>
        <div
          className={`w-min max-w-xs ${hidden ? 'hidden' : 'block'} bg-white dark:bg-gray-800 border-0 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 no-underline break-words text-gray-900 dark:text-white text-sm font-normal`}
          style={styles.offset}
        >
          <div className="p-2">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}