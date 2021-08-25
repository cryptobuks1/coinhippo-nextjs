import PropTypes from 'prop-types'

export const Badge = ({
  rounded = false,
  outlined = false,
  size = 'default',
  color = '',
  onClick,
  children
}) => {
  let css = []

  css.push(color)

  if (rounded) css.push('rounded-lg')

  if (size === 'default') {
    css.push(`text-xs ${color.includes('px-') ? '' : 'px-2'} py-1`)
  }
  else if (size === 'sm') {
    css.push(`text-xs ${color.includes('px-') ? '' : 'px-2'} py-0`)
  }
  else if (size === 'lg') {
    css.push(`text-xs ${color.includes('px-') ? '' : 'px-2'} py-2`)
  }

  css = css.join(' ')

  if (outlined) {
    return (
      <span onClick={onClick} className={`bg-transparent border border-current inline-flex uppercase ${css.includes('font-') ? '' : 'font-semibold'} text-center ${css}`}>
        {children}
      </span>
    )
  }

  return (
    <span onClick={onClick} className={`inline-flex uppercase ${css.includes('font-') ? '' : 'font-semibold'} text-center badge-${size} ${css}`}>
      {children}
    </span>
  )
}

Badge.propTypes = {
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  rounded: PropTypes.bool,
  outlined: PropTypes.bool,
  color: PropTypes.string,
  children: PropTypes.any,
}

export const CircularBadge = ({
  size = 'default',
  outlined = false,
  color,
  onClick,
  children
}) => {
  let css = []

  css.push(color)

  if (size === 'sm') {
    css.push('w-4 h-4 rounded-full inline-flex items-center justify-center text-2xs')
  }
  else if (size === 'lg') {
    css.push('w-6 h-6 rounded-full inline-flex items-center justify-center text-xs')
  }
  else {
    css.push('w-5 h-5 rounded-full inline-flex items-center justify-center text-2xs')
  }

  css = css.join(' ')

  if (outlined) {
    return (
      <span onClick={onClick} className={`bg-transparent leading-none border border-current inline-flex uppercase font-semibold text-center p-0 ${css}`}>
        {children}
      </span>
    )
  }

  return (
    <span onClick={onClick} className={`leading-none inline-flex uppercase font-semibold text-center p-0 ${css}`}>
      {children}
    </span>
  )
}

CircularBadge.propTypes = {
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  color: PropTypes.string,
  onClick: PropTypes.any,
  children: PropTypes.any,
}