import classNames from 'classnames/bind'
import styles from './Wrapper.module.scss'

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
            <div
              className={cx('background')}
              style={{
                backgroundImage: background ? `url("${background}")` : 'none'
              }}
            ></div>
          )}
          {Content}
        </div>
        {children}
      </main>
    </div>
  )
}

export default Wrapper
