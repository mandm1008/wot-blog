import classNames from 'classnames/bind'
import styles from '~/styles/About.module.scss'
import Wrapper from '~/components/Wrapper'
import Link from '~/components/Link'
import { BsFillArrowRightCircleFill } from 'react-icons/bs'

const cx = classNames.bind(styles)

function Page404() {
  return (
    <Wrapper
      background="/about.jpg"
      Content={
        <div className={cx('head')}>
          404 - Page not found! Go home
          <br />
          <Link href="/">
            <BsFillArrowRightCircleFill />
          </Link>
        </div>
      }
    ></Wrapper>
  )
}

export default Page404
