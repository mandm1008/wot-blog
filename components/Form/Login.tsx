import { useState, useRef, memo, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Form.module.scss'
import CheckBox from '../CheckBox'
import Button from '../Button'
import { useStore, actions } from '../store'
import { validateEmail, handleEnterKeyEvent, handleChangeInputKeyEvent, validateValue } from './validator'
import { Google } from '~/config'
import { UserServer } from '~/servers'

const cx = classNames.bind(styles)

interface Props {
  onForgot?: () => void
  onNotAccount?: () => void
  onFinish?: () => void
  message?: string
  defaultEmail?: string
  admin?: boolean
}

function FormLogin({
  onForgot = () => {},
  onNotAccount = () => {},
  onFinish = () => {},
  message,
  defaultEmail,
  admin
}: Props) {
  const [state, dispatch] = useStore()
  const router = useRouter()
  const [email, setEmail] = useState<validateValue>({ value: defaultEmail || '' })
  const [password, setPassword] = useState('')
  const [mess, setMess] = useState(message || '')
  const [isRemember, setIsRemember] = useState(false)
  const [disable, setDisable] = useState(true)
  const passwordElement = useRef<HTMLInputElement>()
  const formGroup = useRef<HTMLDivElement>()

  useEffect(() => handleEnterKeyEvent(formGroup, () => validateEmail({ email, setEmail, setMess })), [email])

  useEffect(() => handleChangeInputKeyEvent(formGroup), [])

  useEffect(() => {
    if (defaultEmail) {
      passwordElement.current!.focus()
    }
    setEmail({ value: defaultEmail || '' })
  }, [defaultEmail])

  useEffect(() => {
    setMess(message || '')
  }, [message])

  useEffect(() => {
    const timeout = setTimeout(() => {
      validateEmail({ email, setEmail, setMess, offMess: true })
    }, 500)
    return () => clearTimeout(timeout)
  }, [email])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (email.correct && password) {
        setDisable(false)
      } else {
        setDisable(true)
      }
    }, 600)
    return () => clearTimeout(timeout)
  }, [email, password])

  async function handler() {
    const user = {
      email: email.value,
      password,
      remember: isRemember
    }

    const data = await UserServer.login(user)

    if (data.error) {
      toast.error(data.error)
      setMess(data.error)
      if (!formGroup.current) return
      const inputs = formGroup.current.querySelectorAll('input')
      for (const input of Array.from(inputs)) {
        if (input.value === data.value) {
          return input.focus()
        }
      }
    } else {
      localStorage.setItem('accountToken', data.accessToken || '')
      onFinish()
      setEmail({ value: '' })
      setPassword('')
      setIsRemember(false)
      dispatch(actions.setUser(data))
      toast.success('Login successfully!')
      if (admin) router.push('/admin')
      return setMess('')
    }
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('logo')}>WoT</div>

      <div className={cx('form')}>
        <div className={cx('title')}>
          <span></span>
          {admin ? 'Login to admin page' : 'Login to WoT or create an account'}
          <span></span>
        </div>

        <div className={cx('message')}>{mess}</div>

        <div ref={formGroup as React.LegacyRef<HTMLDivElement>} className={cx('input-group')}>
          <input
            value={email.value}
            onChange={(e) => setEmail((prev) => ({ ...prev, value: e.target.value }))}
            onBlur={(e) => {
              validateEmail({ email, setEmail, setMess })
              e.target.value || setMess('Email is required!')
            }}
            type="text"
            placeholder="Email"
          />
          <input
            ref={passwordElement as React.LegacyRef<HTMLInputElement>}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <Button primary auto onClick={handler} disable={disable}>
            Login
          </Button>
        </div>

        {admin || (
          <>
            <div className={cx('options')}>
              <label htmlFor="remember" className={cx('remember')}>
                <CheckBox
                  className={cx('checkbox')}
                  id="remember"
                  checked={isRemember}
                  onChange={(e) => setIsRemember(e.target.checked)}
                />
                Remember me
              </label>
              <span className={cx('forgot')} onClick={onForgot}>
                Forgot password?
              </span>
            </div>
            <span className={cx('or')}>Or login with</span>
            <div className={cx('moreLogin')}>
              <Google onFinish={onFinish} />
            </div>
          </>
        )}

        {admin || (
          <div className={cx('footer')}>
            Don’t have an account? <span onClick={onNotAccount}>Join WoT now!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(FormLogin)
