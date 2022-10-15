import { forwardRef } from 'react'
import Tippy from '@tippyjs/react/headless'
import classNames from 'classnames/bind'
import styles from './NavPopper.module.scss'

const cx = classNames.bind(styles)

interface Props {
  children: JSX.Element
  className?: string
  content?: React.ReactNode
  style?: React.CSSProperties
  trigger?: string
}

function NavPopper({ children, className, content, style, trigger }: Props, ref: any) {
  return (
    <Tippy
      ref={ref}
      trigger={trigger}
      interactive
      appendTo={() => document.body}
      placement="bottom"
      render={(attrs) => (
        <div
          className={cx('wrapper', {
            [className as any]: className
          })}
          style={style}
          tabIndex={-1}
          {...attrs}
        >
          {content}
        </div>
      )}
    >
      {children}
    </Tippy>
  )
}

export default forwardRef(NavPopper)
