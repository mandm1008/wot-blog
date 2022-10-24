import { useRef, useEffect, useState, forwardRef, useCallback } from 'react'
import classNames from 'classnames/bind'
import styles from './Timer.module.scss'
import Button from '../Button'

const cx = classNames.bind(styles)

function Timer({ timeString }: { timeString?: string }, ref: any) {
  const [onRequest, setOnRequest] = useState(!timeString)
  const timerElement = useRef<HTMLInputElement>()

  function handler() {
    setOnRequest(true)
    setTimeout(() => {
      setOnRequest(false)
    }, 30000)
  }

  const setTime = useCallback(() => {
    const currentTime = timeString ? new Date(timeString) : new Date()
    timerElement.current!.value = currentTime.toISOString().substring(0, currentTime.toISOString().indexOf('T') + 6)
  }, [timeString])

  useEffect(() => {
    setTime()

    if (ref) ref.current = timerElement
  }, [ref, setTime])

  return (
    <div className={cx('wrapper')}>
      <input
        ref={timerElement as React.LegacyRef<HTMLInputElement>}
        type="datetime-local"
        readOnly={!onRequest}
        disabled={!onRequest}
      />
      <Button onClick={setTime} outline style={{ marginLeft: '20px', height: 'auto', padding: '8px 20px' }}>
        Reset
      </Button>
      {timeString && (
        <Button onClick={handler} primary disable={onRequest} style={{ display: 'block' }}>
          Request Change {onRequest && <CountDown />}
        </Button>
      )}
    </div>
  )
}

function CountDown({ time = 30 }) {
  const [t, setT] = useState(time)

  useEffect(() => {
    const interval = setInterval(() => {
      setT((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <span>({t})s</span>
}

export default forwardRef(Timer)
