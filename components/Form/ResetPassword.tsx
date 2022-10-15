import { useState, memo, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Form.module.scss'
import Button from '../Button'
import { validateEmail, handleEnterKeyEvent, validateValue, handleState } from './validator'
import { UserServer } from '~/servers'

const cx = classNames.bind(styles)

function FormResetPassword({
  onRemember = () => {},
  onNotAccount = () => {}
}: {
  onRemember?: () => void
  onNotAccount?: () => void
}) {
  const [email, setEmail] = useState<validateValue>({ value: '' })
  const [disable, setDisable] = useState(true)
  const formGroup = useRef<HTMLDivElement>()

  async function handler() {
    toast.loading('Send email...', { id: 'send-email' })
    setDisable(true)
    const res = await UserServer.resetPassword({ email: email.value })

    if (res.error) {
      toast.error(res.error, { id: 'send-email' })
      setDisable(false)
      if (!formGroup.current) return
      const inputs = formGroup.current.querySelectorAll('input')
      for (const input of Array.from(inputs)) {
        if (input.value === res.value) {
          return input.focus()
        }
      }
    } else {
      toast.success('Send email successfully!', { id: 'send-email' })
    }
  }

  useEffect(() => handleEnterKeyEvent(formGroup, () => validateEmail({ email, setEmail })), [email])

  useEffect(() => {
    const timeout = setTimeout(() => {
      validateEmail({ email, setEmail })
    }, 500)
    return () => clearTimeout(timeout)
  }, [email])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (email.value && email.correct) {
        setDisable(false)
      } else {
        setDisable(true)
      }
    }, 600)
    return () => clearTimeout(timeout)
  }, [email])

  return (
    <div className={cx('wrapper')}>
      <div className={cx('logo')}>WoT</div>

      <div className={cx('form')}>
        <div className={cx('title')}>
          <span></span>
          Login to WoT or create an account
          <span></span>
        </div>

        <div ref={formGroup as React.LegacyRef<HTMLDivElement>} className={cx('input-group')}>
          <input
            value={email.value}
            onChange={(e) => setEmail((prev) => ({ ...prev, value: e.target.value }))}
            type="text"
            placeholder="Email"
          />
          <Button primary auto onClick={handler} disable={disable}>
            Submit
          </Button>
        </div>

        <div className={cx('options')}>
          <span className={cx('forgot')} onClick={onRemember}>
            Already a remember?
          </span>
        </div>

        <div className={cx('footer')}>
          Don’t have an account? <span onClick={onNotAccount}>Join WoT now!</span>
        </div>
      </div>
    </div>
  )
}

export default memo(FormResetPassword)
