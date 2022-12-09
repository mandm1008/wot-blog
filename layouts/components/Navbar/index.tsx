import { memo, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Image from '~/config/image'
import { ReferenceElement } from 'tippy.js'
import className from 'classnames/bind'

import styles from './Navbar.module.scss'
import { NavPopper } from '~/components/Popper'
import { SearchIcon } from '~/components/Icons'
import Link from '~/components/Link'
import PostItem from '../PostItem'
import Progress from '~/components/Progress'
import NavPost from '../NavPost'
import UserPopper from '~/components/UserPopper'
import { IoClose } from 'react-icons/io5'
import { SWRServer } from '~/servers'

const cx = className.bind(styles)

interface Props {
  top?: boolean
  isTopNav?: boolean
  openSearch?: () => void
  openLogin?: () => void
  openRegister?: () => void
}

function Navbar({ top, isTopNav, openSearch = () => {}, openLogin = () => {}, openRegister = () => {} }: Props) {
  const { data = [] } = useSWR<Apis.ApiHeader>('/api/data/header', SWRServer.fetcher)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(router.pathname.startsWith('/posts'))
  const userPopper = useRef<ReferenceElement>()

  function hideTippy() {
    userPopper.current!._tippy!.hide()
  }
  const handleOpenLogin = useCallback(() => {
    openLogin()
    hideTippy()
  }, [openLogin])
  const handleOpenRegister = useCallback(() => {
    openRegister()
    hideTippy()
  }, [openRegister])

  useEffect(() => {
    setIsOpen(router.pathname.startsWith('/posts'))
  }, [router.pathname])
  useEffect(() => {
    if (data.length > 0) {
      const evt = new Event('finishLoadingHeader', {
        bubbles: true
      })

      window.dispatchEvent(evt)
    }
  }, [data])
  useEffect(() => {
    if (!isTopNav) {
      hideTippy()
    }
  }, [isTopNav])

  return (
    <nav
      className={cx('navbar', {
        topNav: top,
        postRoute: router.pathname.startsWith('/posts'),
        closePostRoute: !isOpen,
        openTopNav: isTopNav
      })}
    >
      {top && (
        <Link href="/" className={cx('logo')}>
          <Image
            src="/logo.png"
            alt="writeortalk.com"
            width={50}
            height={50}
            objectFit="contain"
            objectPosition="center"
          />
        </Link>
      )}
      <div className={cx('nav-main')}>
        {top && router.pathname.startsWith('/posts') && !isOpen && (
          <IoClose className={cx('close-icon')} onClick={() => setIsOpen(true)} />
        )}
        {data.map((category, i) => (
          <NavPopper
            key={category._id}
            style={{
              ['--cl' as any]: category.color
            }}
            content={
              <>
                {category.posts.map((post) => (
                  <PostItem key={post._id} data={post} />
                ))}
              </>
            }
          >
            <li className={cx('nav-item')} style={{ ['--cl' as any]: category.color, ['--i' as any]: i }}>
              <Link href={`/category/${category.slug}`}>{category.title}</Link>
            </li>
          </NavPopper>
        ))}
        {top && router.pathname.startsWith('/posts') && (
          <NavPost slug={router.query.slug as string} isOpen={isOpen} onClickMenu={() => setIsOpen(false)} />
        )}
      </div>

      <ul className={cx('nav-controls')}>
        {/* <NavPopper
          className={cx('cl-3', 'controls-popper')}
          content={
            <Link href="/" className={cx('language')}>
              vi
            </Link>
          }
        > */}
        <li className={cx('controls-item')}>
          <p>en</p>
          <span className={cx('arrow-down')}></span>
        </li>
        {/* </NavPopper> */}

        <li onClick={openSearch} className={cx('controls-item')}>
          <SearchIcon size="16" />
        </li>

        <UserPopper ref={userPopper} openLogin={handleOpenLogin} openRegister={handleOpenRegister} />
      </ul>

      {top && <Progress />}
    </nav>
  )
}

export default memo(Navbar)
