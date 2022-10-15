import { useState, useEffect, useRef, memo } from 'react'
import classNames from 'classnames/bind'
import styles from './Modal.module.scss'

const cx = classNames.bind(styles)

interface Props {
  visible: boolean
  children: React.ReactNode
  className?: string
  overplayClassName?: string
  onClickOutside?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function Modal({ visible, children, className, overplayClassName, onClickOutside = () => {}, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(visible)
  const overplayElement = useRef<HTMLDivElement>()

  useEffect(() => {
    if (visible) {
      setIsOpen(true)
    } else {
      overplayElement.current!.classList.add(cx('hidden'))
      const timeout = setTimeout(() => {
        overplayElement.current!.classList.remove(cx('hidden'))
        setIsOpen(false)
      }, 500)

      return () => clearTimeout(timeout)
    }
  }, [visible])

  return (
    <div
      ref={overplayElement as React.LegacyRef<HTMLDivElement>}
      className={cx('overplay', { visible: isOpen, [overplayClassName as any]: overplayClassName })}
      onClick={onClickOutside}
    >
      <div className={cx('wrapper', { [className as any]: className })} onClick={(e) => e.stopPropagation()} {...props}>
        {children}
      </div>
    </div>
  )
}

export default memo(Modal)
