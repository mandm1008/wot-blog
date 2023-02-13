import { useRef, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import classNames from 'classnames/bind'
import styles from '~/styles/About.module.scss'
import Wrapper from '~/components/Wrapper'
import { server } from '~/config/constants'
import { TEAM_LIST } from '~/config/members'
import Image from '~/config/image'
import teamAvatar from '~/public/teams'

const cx = classNames.bind(styles)

function About() {
  const innerElements = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    function handler() {
      innerElements.current.forEach((element) => {
        if (element !== null) {
          const rect = element.getBoundingClientRect()

          if (window.scrollY > rect.top + 10) {
            element.classList.add(styles.active)
          } else {
            element.classList.remove(styles.active)
          }
        }
      })
    }

    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
      Content={
        <div className={cx('head')}>
          <span className={cx('team')}>Team</span>
          <h1 className={cx('title')}>Fueled by Passion</h1>
          <h2 className={cx('sub-title')}>Discover the WoT Team</h2>
        </div>
      }
    >
      <div className={cx('wrapper')}>
        {TEAM_LIST.map((member, i) => (
          <div
            ref={(ref) => (innerElements.current[i] = ref)}
            key={member.name}
            className={cx('inner', { left: i % 2 !== 0 })}
          >
            <Image src={teamAvatar[member.avatar]} alt={member.name} className={cx('avatar')} width={300} />

            <div className={cx('content')}>
              <h3 className={cx('name')}>{member.name}</h3>
              <p className={cx('jobs')}>{member.jobs.reduce((prev, curr) => prev + ', ' + curr)}</p>

              <div className={cx('discription')}>
                {member.discriptions.map((value) => (
                  <>
                    {value.title && <h4>{value.title}</h4>}
                    <p style={value.style}>{value.content}</p>
                  </>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

export default About
