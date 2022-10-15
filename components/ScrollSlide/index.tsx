import { memo } from 'react'
import classNames from 'classnames/bind'
import styles from './ScrollSlide.module.scss'
import { ArrowLeftIcon, ArrowRightIcon } from '../Icons'
import Link from '../Link'

const cx = classNames.bind(styles)

interface Props {
  size: number
  sizeIcon: number | string
  onPrev?: () => void
  onNext?: () => void
  hrefLeft?: string | URL
  hrefRight?: string | URL
}

function ScrollSlide({ size, sizeIcon, onPrev = () => {}, onNext = () => {}, hrefLeft, hrefRight }: Props) {
  const Btn = hrefLeft || hrefRight ? Link : 'button'

  return (
    <div
      className={cx('wrapper')}
      style={{
        width: size * 2 + 'px',
        height: size + 'px'
      }}
    >
      <Btn href={hrefLeft || ''} onClick={onPrev} className={cx('icon', 'left')}>
        <ArrowLeftIcon size={sizeIcon} />
      </Btn>
      <Btn href={hrefRight || ''} onClick={onNext} className={cx('icon', 'right')}>
        <ArrowRightIcon size={sizeIcon} />
      </Btn>
    </div>
  )
}

export default memo(ScrollSlide)
