import { NextSeo } from 'next-seo'
import { useState } from 'react'
import classNames from 'classnames/bind'

import styles from '~/styles/Contact.module.scss'
import Wrapper from '~/components/Wrapper'
import Button from '~/components/Button'
import { server } from '~/config/constants'

const cx = classNames.bind(styles)

function Contact() {
  const [message, setMessage] = useState('')
  function handleSendMessage() {
    window.open(`mailto:wotblog1306@gmail.com?subject=Contact&body=${encodeURIComponent(message)}`)
  }

  return (
    <Wrapper
      Head={
        <NextSeo
          title="Contact"
          description="wotblog1306@gmail.com"
          canonical="https://writeortalk.com/contact"
          openGraph={{
            url: 'https://writeortalk.com/contact',
            title: 'Contact Write or Talk Team',
            description: 'wotblog1306@gmail.com',
            images: [
              {
                url: `${server}/about.jpg`,
                alt: 'Contact Write or Talk Team',
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
          <div className={cx('slogan')}>
            <p className={cx('slogan-about')}>Contact us</p>
            <h1 className={cx('slogan-title')}>Write or Talk Team</h1>
          </div>
        </div>
      }
    >
      <div className={cx('content')}>
        <h1>Send Message</h1>
        <p>
          Contact mail: <span>wotblog1306@gmail.com</span>
        </p>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message..."></textarea>
        <Button primary l onClick={handleSendMessage}>
          Send Mail
        </Button>
      </div>
    </Wrapper>
  )
}

export default Contact
