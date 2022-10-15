import { memo } from 'react'
import classNames from 'classnames/bind'
import styles from './Category.module.scss'
import Link from '../Link'

const cx = classNames.bind(styles)

interface Props {
  data: Models.Category
  small?: boolean
  style?: React.CSSProperties
}

function Category({ data, small, style }: Props) {
  return (
    <Link
      key={data._id}
      href={'/category/' + data.slug}
      className={cx('category', { small })}
      style={{
        ['--cl' as any]: data.color,
        ...style
      }}
    >
      {data.title}
    </Link>
  )
}

export default memo(Category)
