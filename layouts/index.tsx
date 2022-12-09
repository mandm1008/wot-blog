import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import classnames from 'classnames/bind'

import styles from './Layout.module.scss'
import { useStore, actions } from '../components/store'
import Header from './components/Header'

const Footer = dynamic(() => import('./components/Footer'))

const cx = classnames.bind(styles)
const defaultHeight = 184

function Layout({ children }: { children: JSX.Element }) {
  const [{ layout }, dispatch] = useStore()
  const [pt, setPt] = useState(defaultHeight)
  const headerElement = useRef<HTMLDivElement>()

  useEffect(() => {
    function handler() {
      setPt(headerElement.current ? headerElement.current.offsetHeight : defaultHeight)
    }

    window.addEventListener('finishLoadingHeader', handler)
    return () => window.removeEventListener('finishLoadingHeader', handler)
  }, [])

  useEffect(() => {
    document.querySelector('html')!.style.fontSize = layout === 1 ? '50%' : layout === 2 ? '56.25%' : '62.5%'
  }, [layout])

  useEffect(() => {
    dispatch(actions.setLayout(getLayoutType(window.innerWidth))) // window.innerWidth | window.screen.availWidth
    function handler() {
      dispatch(actions.setLayout(getLayoutType(window.innerWidth))) // window.innerWidth | window.screen.availWidth
      setPt(headerElement.current ? headerElement.current.offsetHeight : defaultHeight)
    }
    function getLayoutType(width: number) {
      if (width > 1023) return 3
      if (width > 767) return 2
      return 1
    }

    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [dispatch])

  return (
    <div className={cx('wrapper')}>
      <Header ref={headerElement} />
      <div
        style={{
          ['--header-height' as any]: pt + 20 + 'px',
          ['--header-height-m' as any]: -pt - 20 + 'px'
        }}
        className={cx('content')}
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
