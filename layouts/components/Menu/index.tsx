import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { ReferenceElement } from 'tippy.js'
import classNames from 'classnames/bind'

import styles from './Menu.module.scss'
import { useStore } from '~/components/store'
import Modal from '~/components/Modal'
import UserPopper from '~/components/UserPopper'
import Link from '~/components/Link'
import Button from '~/components/Button'
import Progress from '~/components/Progress'
import NavPost from '../NavPost'
import { SearchIcon } from '~/components/Icons'
import { SWRServer } from '~/servers'
import { AiFillFacebook, AiFillYoutube, AiFillGooglePlusCircle } from 'react-icons/ai'
import { TbViewfinder } from 'react-icons/tb'

const cx = classNames.bind(styles)

function Menu({ openLogin = () => {}, openRegister = () => {} }: { openLogin: () => void; openRegister: () => void }) {
  const router = useRouter()
  const [{ user }] = useStore()
  const { data = [] } = useSWR<Apis.ApiHeader>('/api/data/header', SWRServer.fetcher)
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isOpen, setIsOpen] = useState(router.pathname.startsWith('/posts'))
  const userElement = useRef<ReferenceElement>()

  function hideTippy() {
    userElement.current!._tippy!.hide()
  }
  const handleLogin = useCallback(() => {
    openLogin()
    hideTippy()
  }, [openLogin])
  const handleRegister = useCallback(() => {
    openRegister()
    hideTippy()
  }, [openRegister])
  function handleSearch(value = searchValue) {
    if (value.trim()) {
      router.push('/search?q=' + encodeURIComponent(value.trim()))
      setSearchValue('')
      setIsOpenMenu(false)
    }
  }

  useEffect(() => {
    setIsOpen(router.pathname.startsWith('/posts'))
  }, [router.pathname])

  return (
    <div className={cx('wrapper')}>
      <Link href="/" className={cx('logo')}>
        <Image src="/logo.png" alt="WoT Blog" width={50} height={50} objectFit="contain" objectPosition="center" />
      </Link>
      <div className={cx('ctn')}>
        <div
          className={cx('controls')}
          style={{ transform: `translateY(${isOpen ? '-60px' : '0'})`, opacity: isOpen ? '0' : '1' }}
        >
          {router.pathname.startsWith('/posts') && (
            <TbViewfinder
              onClick={() => {
                setIsOpen(true)
              }}
              style={{ cursor: 'pointer' }}
            />
          )}
          <UserPopper size="24" ref={userElement} openLogin={handleLogin} openRegister={handleRegister} />
          <div className={cx('menu-icon', { closed: isOpenMenu })} onClick={() => setIsOpenMenu((prev) => !prev)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {router.pathname.startsWith('/posts') && (
          <NavPost slug={router.query.slug as string} isOpen={isOpen} onClickMenu={() => setIsOpen(false)} />
        )}
      </div>

      <Modal visible={isOpenMenu} overplayClassName={cx('overplay')} className={cx('modal')}>
        <div className={cx('search')}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={(e) =>
              e.key === 'Enter' &&
              (e.target as { value?: string }).value &&
              handleSearch((e.target as { value?: string }).value)
            }
            spellCheck={false}
            placeholder="Search anything..."
          />
          <span onClick={() => handleSearch()} className={cx('icon-search')}>
            <SearchIcon size="20" />
          </span>
        </div>

        <div className={cx('item', 'categories')}>
          <span>Categories</span>
          {data.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug}`}
              className={cx('category')}
              style={{ ['--cl' as any]: category.color }}
              onClick={() => setIsOpenMenu(false)}
            >
              {category.title}
            </Link>
          ))}
        </div>

        {!user && (
          <div className={cx('item', 'user')}>
            <Button
              style={{ width: '250px', height: '50px' }}
              outline
              onClick={() => {
                openRegister()
                setIsOpenMenu(false)
              }}
            >
              JOIN NOW
            </Button>
            <Button
              style={{ width: '250px', height: '50px' }}
              outline
              onClick={() => {
                openLogin()
                setIsOpenMenu(false)
              }}
            >
              LOGIN
            </Button>
          </div>
        )}

        <div className={cx('item', 'share')}>
          <Link href="/" target="_blank" className={cx('icon')}>
            <AiFillFacebook className={cx('icon')} />
          </Link>
          <Link href="/" target="_blank" className={cx('icon')}>
            <AiFillYoutube className={cx('icon')} />
          </Link>
          <Link href="/" target="_blank" className={cx('icon')}>
            <AiFillGooglePlusCircle className={cx('icon')} />
          </Link>

          <div className={cx('foot-logo')}>
            <span></span>
            <div className={cx('logo')}>WoT</div>
            <span></span>
          </div>
        </div>
      </Modal>

      <Progress />
    </div>
  )
}

export default Menu
