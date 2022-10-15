import { useRouter } from 'next/router'
import { useState, useEffect, useCallback, forwardRef, memo } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Header.module.scss'
import { useStore } from '~/components/store'
import Modal from '~/components/Modal'
import Navbar from '../Navbar'
import Link from '~/components/Link'
import Menu from '../Menu'
import { getRule } from '~/components/Form/validator'
import { FormLogin, FormRegister, FormResetPassword } from '~/components/Form'
import { ArrowTopIcon, CloseIcon } from '~/components/Icons'

const cx = classNames.bind(styles)

type ModeModel = 'search' | 'login' | 'register' | 'reset'

function Header(props: any, ref: any) {
  const [{ layout }] = useStore()
  const [isOpenTopNav, setIsOpenTopNav] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modeModal, setModeModal] = useState<ModeModel>('search')
  const [{ message, email }, setMessage] = useState<{ message?: string; email?: string }>({})
  const router = useRouter()

  useEffect(() => {
    window.addEventListener('scroll', handler)

    function handler() {
      if (window.scrollY > 340) {
        setIsOpenTopNav(true)
      } else {
        setIsOpenTopNav(false)
      }
    }

    return () => window.removeEventListener('scroll', handler)
  }, [])
  useEffect(() => {
    function handler() {
      setIsOpenModal(true)
      setModeModal('login')
    }

    window.addEventListener('openLogin', handler)
    return () => window.removeEventListener('openLogin', handler)
  }, [])
  useEffect(() => {
    const email = router.query.emailUser
    if (email && typeof email === 'string' && !getRule().email(email)) {
      setModeModal('login')
      setMessage({ email })
      setIsOpenModal(true)
      toast.success('Account is active!', { id: 're-send' })
    }
  }, [router])

  const handlerSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.target as { value?: string }).value && e.key === 'Enter') {
        router.push('/search?q=' + searchValue)
        setIsOpenModal(false)
      }
    },
    [router, searchValue]
  )
  const changeSearchValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value || ''),
    []
  )

  const openSearch = useCallback(() => {
    setModeModal('search')
    setIsOpenModal(true)
  }, [])
  const openLogin = useCallback(() => {
    setModeModal('login')
    setIsOpenModal(true)
  }, [])
  const openRegister = useCallback(() => {
    setModeModal('register')
    setIsOpenModal(true)
  }, [])
  const handleForgot = useCallback(() => setModeModal('reset'), [])
  const handleRegister = useCallback(() => setModeModal('register'), [])
  const handleLogin = useCallback(() => setModeModal('login'), [])
  const handleGetUser = useCallback(() => setIsOpenModal(false), [])
  const closeModal = useCallback(() => setIsOpenModal(false), [])

  return (
    <div ref={ref} className={cx('wrapper')} style={{ paddingTop: layout !== 3 ? '60px' : '0' }}>
      {layout !== 3 && <Menu openLogin={openLogin} openRegister={openRegister} />}

      <Link href="/" className={cx('logo')}>
        <h1>Write Or Talk</h1>
        <p>We&apos;re copywriter</p>
        {/* <Image src="/logo.svg" alt="WoT Blog" width={600} height={200} /> */}
      </Link>

      {layout === 3 && <Navbar openSearch={openSearch} openLogin={openLogin} openRegister={openRegister} />}
      {layout === 3 && !router.pathname.startsWith('/admin') && (
        <Navbar isTopNav={isOpenTopNav} top openSearch={openSearch} openLogin={openLogin} openRegister={openRegister} />
      )}

      <Modal visible={isOpenModal}>
        {modeModal === 'search' && (
          <div>
            <h6 className={cx('title-search')}>Search anything and hit enter</h6>
            <input
              type="text"
              placeholder="Search..."
              className={cx('input-search')}
              spellCheck={false}
              value={searchValue}
              onChange={changeSearchValue}
              onKeyUp={handlerSearch}
            />
          </div>
        )}
        {modeModal === 'login' && (
          <div className={cx('form')}>
            <FormLogin
              onForgot={handleForgot}
              onNotAccount={handleRegister}
              onFinish={handleGetUser}
              message={message}
              defaultEmail={email}
            />
          </div>
        )}
        {modeModal === 'register' && (
          <div className={cx('form')}>
            <FormRegister onHaveAccount={handleLogin} onSuccess={closeModal} />
          </div>
        )}
        {modeModal === 'reset' && (
          <div className={cx('form')}>
            <FormResetPassword onRemember={handleLogin} onNotAccount={handleRegister} />
          </div>
        )}

        <div className={cx('close-btn')} onClick={closeModal}>
          <CloseIcon size="15" />
        </div>
      </Modal>

      <a href="#" className={cx('scroll-top', { hidden: !isOpenTopNav })}>
        <div>
          <span></span>
        </div>
        <ArrowTopIcon size={10} />
      </a>
    </div>
  )
}

export default memo(forwardRef(Header))
