import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './PathMenu.module.scss'
import Link from '../Link'
import { FcRight, FcHome } from 'react-icons/fc'

function PathMenu() {
  const router = useRouter()
  const [paths, setPaths] = useState<string[]>([])

  useEffect(() => {
    setPaths(router.pathname.split('/').slice(1))
  }, [router])

  return (
    <div className={styles.wrapper}>
      <FcHome className={styles.icon} />
      {paths.map((path, i) => (
        <span className={styles.item} key={i}>
          <Link href={router.pathname.substring(0, router.pathname.indexOf(path) + path.length)}>{path}</Link>
          {i !== paths.length - 1 && <FcRight className={styles.icon} />}
        </span>
      ))}
    </div>
  )
}

export default memo(PathMenu)
