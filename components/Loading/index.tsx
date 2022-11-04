import styles from './Loading.module.scss'

function Loading({ ellipsis }: { ellipsis?: boolean }) {
  if (ellipsis)
    return (
      <div className={styles['lds-ellipsis']}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )

  return (
    <div className={styles['lds-facebook']}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Loading
