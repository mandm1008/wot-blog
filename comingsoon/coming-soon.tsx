import { NextSeo } from 'next-seo'
import classNames from 'classnames/bind'
import styles from '~/styles/About.module.scss'
import Wrapper from '~/components/Wrapper'
import { server } from '~/config/constants'

const cx = classNames.bind(styles)

function ComingSoon() {
  return (
    <Wrapper
      Head={
        <NextSeo
          title="Coming Soon"
          canonical="https://writeortalk.com/coming-soon"
          openGraph={{
            url: 'https://writeortalk.com/coming-soon',
            title: 'Coming Soon',
            images: [
              {
                url: `${server}/about.jpg`,
                alt: 'Coming Soon',
                width: 800,
                height: 600
              }
            ]
          }}
        />
      }
      background={`${server}/about.jpg`}
      Content={<div className={cx('head')}>Coming Soon...</div>}
    ></Wrapper>
  )
}

export default ComingSoon
