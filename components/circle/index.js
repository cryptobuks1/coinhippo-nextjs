import { useSelector, shallowEqual } from 'react-redux'
import Circle from 'react-circle'

export default function CircleComponent({ size, progress, color }) {
  const { theme } = useSelector(state => ({ theme: state.theme }), shallowEqual)
  const { background } = { ...theme }

  const bgColor = background === 'dark' ? '#27272a' : '#fafafa'

  const s = size === 'sm' ? 60 : size === 'lg' ? 140 : 100
  const w = size === 'sm' ? 30 : 40

  return (
    <Circle
      progress={progress}
      progressColor={color}
      bgColor={bgColor}
      textColor={color}
      showPercentageSymbol={true}
      textStyle={{ font: 'normal 6rem Open Sans, Helvetica, sans-serif' }}
      size={s}
      lineWidth={w}
    />
  )
}