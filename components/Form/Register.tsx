import { memo, useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Form.module.scss'
import Button from '../Button'
import {
  validateEmail,
  validatePassword,
  validateRePassword,
  handleEnterKeyEvent,
  handleChangeInputKeyEvent,
  validateValue
} from './validator'
import { UserServer } from '~/servers'

const cx = classNames.bind(styles)

function FormRegister({
  onHaveAccount = () => {},
  onSuccess = () => {}
}: {
  onHaveAccount?: () => void
  onSuccess?: () => void
}) {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState<validateValue>({ value: '' })
  const [password, setPassword] = useState<validateValue>({ value: '' })
  const [rePassword, setRePassword] = useState<validateValue>({ value: '' })
  const [error, setError] = useState('')
  const [disabled, setDisabled] = useState(true)
  const formGroup = useRef<HTMLDivElement>()

  async function handler() {
    const user = {
      name: userName,
      email: email.value,
      password: password.value
    }

    toast.loading('Creating new user...', { id: 'mess' })
    const data = await UserServer.register(user)

    if (data.error) {
      toast.error(data.error, { id: 'mess', duration: 8000 })
      setError(data.error)
      if (!formGroup.current) return
      const inputs = formGroup.current.querySelectorAll('input')
      for (const input of Array.from(inputs)) {
        if (input.value === data.value) {
          return input.focus()
        }
      }
    } else {
      onSuccess()
      toast.success('Account was created! Check email to active it!', { id: 'mess', duration: 8000 })
    }
  }

  useEffect(
    () =>
      handleEnterKeyEvent(
        formGroup,
        (e) => e.target && !e.target.value && setError('UserName is required'),
        () => validateEmail({ email, setEmail, setMess: setError }),
        () => {
          validateRePassword({ rePassword, password, setRePassword, setMess: setError })
          validatePassword({ password, setPassword, setMess: setError })
        },
        () => validateRePassword({ rePassword, password, setRePassword, setMess: setError })
      ),
    [email, password, rePassword]
  )

  useEffect(() => handleChangeInputKeyEvent(formGroup), [])

  useEffect(() => {
    if (userName && error === 'Username is required') {
      setError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName])

  useEffect(() => {
    const timeout = setTimeout(() => {
      validateEmail({ email, setEmail, setMess: setError, offMess: true })
    }, 500)
    return () => clearTimeout(timeout)
  }, [email])

  useEffect(() => {
    const timeout = setTimeout(() => {
      validateRePassword({ rePassword, setRePassword, password, setMess: setError, offMess: true })
    }, 500)
    return () => clearTimeout(timeout)
  }, [rePassword, password])

  useEffect(() => {
    const timeout = setTimeout(() => {
      validatePassword({ password, setPassword, setMess: setError, offMess: true })
    }, 500)
    return () => clearTimeout(timeout)
  }, [password])

  useEffect(() => {
    const timeout = setTimeout(() => {
      validateAll(false)
    }, 1000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, email, password, rePassword])

  function validateAll(updateMess = true) {
    if (userName && email.correct && password.correct && rePassword.correct) {
      updateMess && setError('')
      setDisabled(false)
    } else {
      setDisabled(true)
      if (email.correct && password.correct && rePassword.correct && !userName) {
        updateMess && setError('Username is required')
      }
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (error) {
        toast.error(error, {
          id: 'mess'
        })
      }
    }, 100)
    return () => clearTimeout(timeout)
  }, [error])

  return (
    <div className={cx('wrapper')}>
      <div className={cx('logo')}>WoT</div>

      <div className={cx('message')}>{error}</div>

      <div className={cx('form')}>
        <div className={cx('title')}>
          <span></span>
          Create your WoT account
          <span></span>
        </div>
        <div ref={formGroup as React.LegacyRef<HTMLDivElement>} className={cx('input-group')}>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            onBlur={(e) => {
              !e.target.value && setError('UserName is required')
              setTimeout(validateAll, 100)
            }}
            placeholder="Username"
          />
          <input
            value={email.value}
            onChange={(e) => setEmail((prev) => ({ ...prev, value: e.target.value }))}
            type="text"
            onBlur={(e) => {
              validateEmail({ email, setEmail, setMess: setError })
              !e.target.value && setError('Email is required')
              setTimeout(validateAll, 100)
            }}
            placeholder="Email"
          />
          <input
            value={password.value}
            onChange={(e) => setPassword((prev) => ({ ...prev, value: e.target.value }))}
            type="password"
            onBlur={(e) => {
              validateRePassword({ rePassword, password, setRePassword, setMess: setError })
              validatePassword({ password, setPassword, setMess: setError })
              !e.target.value && setError('Password is required')
              setTimeout(validateAll, 100)
            }}
            placeholder="Password"
          />
          <input
            value={rePassword.value}
            onChange={(e) => setRePassword((prev) => ({ ...prev, value: e.target.value }))}
            type="password"
            onBlur={(e) => {
              validateRePassword({ rePassword, password, setRePassword, setMess: setError })
              !e.target.value && password.value && setError('Repeat password is required')
              setTimeout(validateAll, 100)
            }}
            placeholder="Repeat Password"
          />
          <Button primary auto onClick={handler} disable={disabled}>
            Join WoT
          </Button>
        </div>
        <div className={cx('options')}>
          <p className={cx('remember')}>By signing up, you agree to our Privacy Policy.</p>
        </div>

        <div className={cx('footer')}>
          Already have an account? <span onClick={onHaveAccount}>Log In!</span>
        </div>
      </div>
    </div>
  )
}

export default memo(FormRegister)
