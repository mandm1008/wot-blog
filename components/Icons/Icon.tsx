import classNames from 'classnames/bind'
import styles from './Icon.module.scss'

const cx = classNames.bind(styles)

interface Props {
  className: string
  size: number | string
  style?: React.CSSProperties
}

function Icon({ className, size, style }: Props) {
  return (
    <i
      className={cx('icon', ...className.split(' '))}
      style={{
        width: size + 'px',
        height: size + 'px',
        fontSize: size + 'px',
        ...style
      }}
    ></i>
  )
}

export default Icon
