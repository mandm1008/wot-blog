import styles from './Loading.module.scss'

function Loading() {
  return (
    <div className={styles['lds-facebook']}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Loading
