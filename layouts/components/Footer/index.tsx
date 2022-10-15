import { memo } from 'react'
import Image from 'next/image'
import classNames from 'classnames/bind'
import styles from './Footer.module.scss'
import Link from '~/components/Link'
import { AiFillFacebook, AiFillYoutube, AiFillGooglePlusCircle } from 'react-icons/ai'

const cx = classNames.bind(styles)

function Footer() {
  return (
    <footer className={cx('wrapper')}>
      <div className={cx('content')}>
        <Link href="/about" className={cx('item')}>
          About us
        </Link>
        <Link href="/course" className={cx('item')}>
          Course
        </Link>
        <Link href="/" className={cx('item', 'main-item')}>
          <Image
            src="/logo2.png"
            alt="writeortalk.com"
            width={50}
            height={50}
            objectFit="contain"
            objectPosition="center"
          />
        </Link>
        <Link href="/contact" className={cx('item')}>
          Contact
        </Link>
        <Link href="/privacy" className={cx('item')}>
          Privacy
        </Link>
      </div>
      <div className={cx('contact')}>
        <Link href="/coming-soon" target="_blank" className={cx('item')}>
          <AiFillFacebook className={cx('icon')} />
          Facebook
        </Link>
        <Link href="/coming-soon" target="_blank" className={cx('item')}>
          <AiFillYoutube className={cx('icon')} />
          Youtube
        </Link>
        <Link href="/coming-soon" target="_blank" className={cx('item')}>
          <AiFillGooglePlusCircle className={cx('icon')} />
          Google +
        </Link>
      </div>
      <div className={cx('license')}>
        I&apos;m a Copywriter
        <span>
          <a
            rel="noopener noreferrer"
            href="https://www.dmca.com/Protection/Status.aspx?ID=121b2450-a6d8-4153-a182-9a4cf64bb841&refurl=https://writeortalk.com/"
            target="_blank"
            title="DMCA.com Protection Status"
            className="dmca-badge"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-07.png?ID=121b2450-a6d8-4153-a182-9a4cf64bb841"
              alt="DMCA.com Protection Status"
            />
          </a>
          <script async src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"></script>
        </span>
      </div>
    </footer>
  )
}

export default memo(Footer)
