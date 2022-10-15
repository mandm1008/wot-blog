import React, { memo, forwardRef } from 'react'
import classNames from 'classnames/bind'
import styles from './Button.module.scss'
import Link from '../Link'

const cx = classNames.bind(styles)

interface Props {
  children: React.ReactNode
  href?: string
  className?: string
  primary?: boolean
  outline?: boolean
  disable?: boolean
  l?: boolean
  auto?: boolean
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
  onKeyUp?: (e: React.KeyboardEvent) => void
}

type Rest = {
  [key: string]: any
}

function Button({ children, href, className, primary, outline, disable, l, auto, ...props }: Props, ref: any) {
  if (disable) {
    const handler = Object.keys(props).filter((key) => key.includes('on'))

    handler.forEach((key) => {
      ;(props as Rest)[key] = () => {}
    })
  }

  return href ? (
    <Link
      href={href}
      className={cx('wrapper', { [className as any]: className, primary, disable, outline, l, auto })}
      {...props}
    >
      {children}
    </Link>
  ) : (
    <button
      ref={ref}
      className={cx('wrapper', { [className as any]: className, primary, disable, outline, l, auto })}
      {...props}
    >
      {children}
    </button>
  )
}

export default memo(forwardRef(Button))
