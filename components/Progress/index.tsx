import { useEffect, useState } from 'react'
import styles from './Progress.module.scss'

function Progress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handler() {
      const screen = window.screen.availHeight
      const height = window.document.body.scrollHeight - screen
      setProgress(Math.ceil((window.scrollY / height) * 100))
    }

    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          width: progress + '%'
        }}
      ></div>
    </div>
  )
}

export default Progress
