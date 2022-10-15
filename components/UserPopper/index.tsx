import { forwardRef, useState, useEffect, useRef, useCallback, memo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './UserPopper.module.scss'
import { NavPopper } from '../Popper'
import Button from '../Button'
import { UserIcon } from '../Icons'
import { useStore, actions } from '../store'
import { UserServer } from '~/servers'

const cx = classNames.bind(styles)

function UserPopper(
  {
    size = 16,
    openLogin = () => {},
    openRegister = () => {}
  }: { size?: string | number; openLogin?: () => void; openRegister?: () => void },
  ref: any
) {
  const [{ user }, dispatch] = useStore()
  const router = useRouter()
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(user ? user.name : '')
  const inputNameElement = useRef<HTMLInputElement>()

  const handleEditUser = async () => {
    const res = await UserServer.edit({ name })

    if (res.error) {
      user && setName(user.name)
    } else {
      setEditMode(false)
      dispatch(actions.setUser(res))
    }
  }

  const handleLogout = () => {
    toast.promise(
      UserServer.logout().then(() => {
        localStorage.setItem('accountToken', '')
        dispatch(actions.setUser(null))
        if (router.pathname.startsWith('/admin')) router.push('/admin/login')
      }),
      {
        loading: 'Logout...',
        success: 'Logout successfully!',
        error: 'Logout failed!'
      }
    )
  }

  const handleOpenEditMode = () => setEditMode(true)

  const handleCancelEditMode = useCallback(() => {
    setEditMode(false)
    user && setName(user.name)
  }, [user])

  useEffect(() => {
    setName(user ? user.name : '')
  }, [user])
  useEffect(() => {
    editMode && inputNameElement.current && inputNameElement.current.focus()
  }, [editMode])

  return (
    <NavPopper
      ref={ref}
      trigger="click"
      className={cx('cl-6', 'controls-popper', 'login-popper')}
      content={
        user !== null ? (
          <>
            <Image src={user.image || '/avatar.png'} alt={user.name} width={60} height={60} />
            {editMode || <p>{user.name}</p>}
            {editMode && (
              <>
                <input
                  ref={inputNameElement as React.LegacyRef<HTMLInputElement>}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className={cx('input')}
                  spellCheck={false}
                />
                <div>
                  <Button
                    onClick={handleCancelEditMode}
                    style={{ padding: '2px 4px', margin: '0', fontSize: '0.8rem', width: '52px' }}
                    outline
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ padding: '0', margin: '0 0 0 12px', fontSize: '0.8rem', width: '52px' }}
                    onClick={handleEditUser}
                    primary
                    disable={name === user.name}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
            <ul className={cx('login-message')}>
              <li onClick={handleOpenEditMode}>Edit</li>
              <li onClick={handleLogout}>Log out</li>
            </ul>
          </>
        ) : (
          <>
            <Button onClick={openLogin} primary>
              Login
            </Button>
            <div className={cx('login-message')}>
              <i>Don’t have an account?</i>
              <span onClick={openRegister}>JOIN WoT NOW!</span>
            </div>
          </>
        )
      }
    >
      <li className={cx('controls-item')}>
        <UserIcon size={size} />
      </li>
    </NavPopper>
  )
}

export default memo(forwardRef(UserPopper))
