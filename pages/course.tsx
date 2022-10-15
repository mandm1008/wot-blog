import { NextSeo } from 'next-seo'
import classNames from 'classnames/bind'
import styles from '~/styles/About.module.scss'
import Wrapper from '~/components/Wrapper'
import { server } from '~/config/constants'

const cx = classNames.bind(styles)

function Course() {
  return (
    <Wrapper
      Head={
        <NextSeo
          title="Course"
          description="All Course"
          canonical="https://writeortalk.com/course"
          openGraph={{
            url: 'https://writeortalk.com/course',
            title: 'Course Write or Talk Blog',
            description: 'All Course',
            images: [
              {
                url: `${server}/about.jpg`,
                alt: 'Course Write or Talk Blog',
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

export default Course
