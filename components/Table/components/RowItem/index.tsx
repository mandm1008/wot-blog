import { useState, forwardRef, useEffect } from 'react'
import classNames from 'classnames/bind'

import styles from './RowItem.module.scss'
import Link from '~/components/Link'

const cx = classNames.bind(styles)

export type OptionsRowItem = {
  link?: (path: string, slug: string) => string
}
export type TypeRowItem = 'text' | 'list' | 'time' | 'input' | 'color'

interface Props {
  data: any
  name: string
  type: TypeRowItem
  options?: OptionsRowItem
  path: string
  className?: string
}

function RowItem({ data = {}, name, type, options = {}, path, ...rest }: Props, ref: any) {
  let Tag: any = 'div'
  const props: any = {
    ...rest
  }
  let children: React.ReactNode

  const [value, setValue] = useState(data[name])

  useEffect(() => {
    setValue(data[name])
  }, [data, name])

  if (type === 'text') {
    children = data[name]
  }
  if (type === 'list') {
    children =
      data[name] &&
      typeof data[name].map === 'function' &&
      data[name].map((item: any) => (
        <div className={cx('item')} key={item._id}>
          {item.title}
        </div>
      ))
  }
  if (type === 'time') {
    if (!data[name]) {
      children = '0'
    } else {
      const time = new Date(data[name])
      children = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}
  ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`
    }
  }
  if (type === 'input') {
    children = (
      <>
        <input
          ref={ref}
          type="text"
          className={cx({ input: value !== data[name] })}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className={cx('old-value')}>{data[name]}</span>
      </>
    )
  }
  if (type === 'color') {
    children = (
      <>
        <input
          ref={ref}
          type="color"
          className={cx({ input: value !== data[name] })}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className={cx('reset-value')} onClick={() => setValue(data[name])}>
          Reset
        </span>
      </>
    )
  }

  if (options.link) {
    Tag = Link
    props.href = options.link(path, data.slug)
  }

  return (
    <Tag data-label={name} {...props}>
      {children}
    </Tag>
  )
}

export default forwardRef(RowItem)
