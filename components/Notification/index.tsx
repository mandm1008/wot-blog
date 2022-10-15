import { Toaster } from 'react-hot-toast'
import classNames from 'classnames/bind'
import styles from './Notification.module.scss'

const cx = classNames.bind(styles)

function Notification() {
  return (
    <div className={cx('wrapper')}>
      <Toaster />
    </div>
  )
}

export default Notification
