import { memo, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './Ads.module.scss'

const cx = classNames.bind(styles)
const lengthAds = [1, 2]

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

function Ads({ className }: { className?: string }) {
  // useEffect(() => {
  //   lengthAds.forEach(() => (window.adsbygoogle = window.adsbygoogle || []).push({}))
  // }, [])

  return (
    <div className={cx('wrapper', { [className as any]: className })}>
      {lengthAds.map((item) => (
        <ins
          key={item}
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '300px', height: '250px' }}
          data-ad-client="ca-pub-1096397626515313"
          data-ad-slot="1948567685"
        ></ins>
      ))}
    </div>
  )
}

export default memo(Ads)
