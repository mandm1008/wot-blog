import { NextSeo } from 'next-seo'
import classNames from 'classnames/bind'
import styles from '~/styles/About.module.scss'
import Wrapper from '~/components/Wrapper'
import { server } from '~/config/constants'

const cx = classNames.bind(styles)

function About() {
  return (
    <Wrapper
      Head={
        <NextSeo
          title="About"
          description="await"
          canonical="https://writeortalk.com/about"
          openGraph={{
            url: 'https://writeortalk.com/about',
            title: 'About Write or Talk Team',
            description: 'await',
            images: [
              {
                url: `${server}/about.jpg`,
                alt: 'About Write or Talk Team',
                width: 800,
                height: 600
              }
            ]
          }}
        />
      }
      background="/about.jpg"
      Content={<div className={cx('head')}>Coming Soon...</div>}
    ></Wrapper>
  )
}

export default About
