import classNames from 'classnames/bind'
import styles from './Wrapper.module.scss'
import Image from '~/config/image'

const cx = classNames.bind(styles)

interface Props {
  children?: React.ReactNode
  Head?: JSX.Element
  Content?: React.ReactNode
  background?: string
}

function Wrapper({ children, Head, Content, background }: Props) {
  return (
    <div className={cx('wrapper')}>
      {Head}

      <main className={cx('main')}>
        <div className={cx('inner', { default: !background })}>
          {background && (
            <div className={cx('background')}>
              <Image src={background} alt="Banner" layout="fill" />
            </div>
          )}
          {Content}
        </div>
        {children}
      </main>
    </div>
  )
}

export default Wrapper
