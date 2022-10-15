import { useRouter } from 'next/router'
import { useState, memo, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Form.module.scss'
import Button from '../Button'
import {
  validatePassword,
  validateRePassword,
  handleEnterKeyEvent,
  handleChangeInputKeyEvent,
  validateValue
} from './validator'
import { UserServer } from '~/servers'

const cx = classNames.bind(styles)

function SendResetPassword({ data }: { data: Apis.ApiUser.ResetPasswordToken }) {
  const router = useRouter()
  const [password, setPassword] = useState<validateValue>({ value: '' })
  const [rePassword, setRePassword] = useState<validateValue>({ value: '' })
  const [mess, setMess] = useState('')
  const [disable, setDisable] = useState(true)
  const formGroup = useRef<HTMLDivElement>()

  async function handler() {
    toast.loading('Reset password...', { id: 'reset-password' })
    setDisable(true)
    if (typeof router.query.encrypt === 'string') {
      const res = await UserServer.resetPasswordAction({ password: password.value, encrypt: router.query.encrypt })

      if (res.error) {
        toast.error('Error updating password!', { id: 'reset-password' })
        setDisable(false)
      } else {
        router.push('/')
        toast.success('Password updated successfully!', { id: 'reset-password' })
      }
    } else {
      toast.error('Page error! Please refresh your page!', { id: 'reset-password' })
    }
  }

  useEffect(
    () =>
      handleEnterKeyEvent(
        formGroup,
        () => validatePassword({ password, setPassword, setMess }),
        () => validateRePassword({ rePassword, password, setRePassword, setMess })
      ),
    [password, rePassword]
  )

  useEffect(() => handleChangeInputKeyEvent(formGroup), [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      validateRePassword({ rePassword, password, setRePassword, setMess, offMess: true })
    }, 500)
    return () => clearTimeout(timeout)
  }, [rePassword, password])

  useEffect(() => {
    const timeout = setTimeout(() => {
      validatePassword({ password, setPassword, setMess, offMess: true })
    }, 500)
    return () => clearTimeout(timeout)
  }, [password])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (password.value && password.correct && rePassword.correct) {
        setDisable(false)
      } else {
        setDisable(true)
      }
    }, 600)
    return () => clearTimeout(timeout)
  }, [password, rePassword])

  useEffect(() => {
    if (mess) toast.error(mess, { id: 'error' })
  }, [mess])

  return (
    <div className={cx('wrapper')}>
      <div className={cx('logo')}>WoT</div>

      <div className={cx('message')}>{mess}</div>

      <div className={cx('form')}>
        <div className={cx('title')}>
          <span></span>
          Hi {data.name}
          <span></span>
        </div>

        <div ref={formGroup as React.LegacyRef<HTMLDivElement>} className={cx('input-group')}>
          <input
            value={password.value}
            onChange={(e) => setPassword((prev) => ({ ...prev, value: e.target.value }))}
            onBlur={(e) => {
              validatePassword({ password, setPassword, setMess })
              e.target.value || setMess('Password is required!')
            }}
            type="password"
            placeholder="New Password..."
          />
          <input
            value={rePassword.value}
            onChange={(e) => setRePassword((prev) => ({ ...prev, value: e.target.value }))}
            onBlur={(e) => {
              validateRePassword({ rePassword, password, setRePassword, setMess })
              password.value && !e.target.value && setMess('Repeat password is required!')
            }}
            type="password"
            placeholder="Confirm Password..."
          />
          <Button primary auto onClick={handler} style={{ marginBottom: '20px' }} disable={disable}>
            Submit
          </Button>
        </div>

        <div className={cx('footer')}>
          Don’t have an account? <span>Join WoT now!</span>
        </div>
      </div>
    </div>
  )
}

export default memo(SendResetPassword)
