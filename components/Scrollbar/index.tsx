import React, { useEffect, useState, useRef, memo } from 'react'
import classNames from 'classnames/bind'
import styles from './Scrollbar.module.scss'
import { CgMenuGridO } from 'react-icons/cg'

const cx = classNames.bind(styles)

function Scrollbar() {
  const [visible, setVisible] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const element = useRef<HTMLDivElement>()
  const timeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    function handler() {
      setVisible(true)
      setScrollTop(window.scrollY / (window.document.body.scrollHeight - window.innerHeight))

      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = undefined
      }

      timeout.current = setTimeout(() => {
        setVisible(false)
      }, 1000)
    }

    window.addEventListener('scroll', handler as any)
    return () => window.removeEventListener('scroll', handler as any)
  }, [])

  useEffect(() => {
    const divElement = element.current
    function handler(e: React.MouseEvent<HTMLDivElement>) {
      clearTimeout(timeout.current)
      setVisible(true)
      const percents = e.clientY / window.innerHeight

      window.scrollTo(0, percents * (window.document.body.scrollHeight - window.innerHeight))
    }

    function handleDown(e: React.MouseEvent<HTMLDivElement>) {
      clearTimeout(timeout.current)
      handler(e)
      window.document.body.style.userSelect = 'none'
      window.document.querySelector('html')!.style.scrollBehavior = 'auto'
      window.addEventListener('mousemove', handler as any)
      window.addEventListener('mouseup', handleUp as any)
    }
    function handleUp() {
      setVisible(false)
      window.document.body.style.userSelect = 'auto'
      window.document.querySelector('html')!.style.scrollBehavior = 'smooth'
      window.removeEventListener('mousemove', handler as any)
      window.removeEventListener('mouseup', handleUp as any)
    }

    divElement?.addEventListener('mousedown', handleDown as any)
    return () => divElement?.removeEventListener('mousedown', handleDown as any)
  }, [])

  function handleHover() {
    element.current!.style.opacity = '1'
    element.current!.style.transform = 'translateX(0)'
  }

  function handleLeave() {
    element.current!.style.opacity = '0'
    element.current!.style.transform = 'translateX(100%)'
  }

  return (
    <div ref={element as React.LegacyRef<HTMLDivElement>} className={cx('wrapper', { visible })}>
      <div
        className={cx('inner')}
        style={{ top: `${scrollTop * 100}%` }}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <CgMenuGridO />
      </div>
    </div>
  )
}

export default memo(Scrollbar)
