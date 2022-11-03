import React, { memo } from 'react'
import Image from 'next/image'
import classNames from 'classnames/bind'

import styles from './PostItem.module.scss'
import { useStore } from '../store'
import Link from '../Link'
import Category from '../Category'
import { getTime, getText } from '~/tools'
import { GrView } from 'react-icons/gr'
import { AiOutlineLike } from 'react-icons/ai'
import { SharedIcon } from '../Icons'

const cx = classNames.bind(styles)

interface Props {
  data: Apis.PostWithCategory
  big?: boolean
  small?: boolean
  list?: boolean
  popular?: boolean
  style?: React.CSSProperties
  fadeOut?: boolean
  fadeIn?: boolean
  transRight?: boolean
  transLeft?: boolean
  rank?: number
}

function PostItem({
  data: { categories = [], ...data },
  big,
  small,
  list,
  popular,
  style,
  fadeOut,
  fadeIn,
  transRight,
  transLeft,
  rank
}: Props) {
  const ImgCtn = big ? 'div' : Link
  const [{ layout }] = useStore()

  return (
    <div
      className={cx({
        wrapper: !big && !small && !list,
        big,
        small,
        list,
        popular,
        fadeOut,
        fadeIn,
        transRight,
        transLeft
      })}
      style={{ ['--cl' as any]: categories[0]?.color, ...style }}
    >
      {rank && <div className={cx('rank')}>{rank}</div>}
      <ImgCtn href={`/posts/${data.slug}`}>
        <Image
          src={data.banner || '/demo.jpg'}
          alt={data.title}
          width={big ? (popular ? 285 : 660) : 360}
          height={big ? (popular ? 170 : 425) : 220}
        />
        {big && (
          <div className={cx('container')}>
            <div className={cx('category')}>
              {categories.map((category) => (
                <Link key={category._id} href={'/category/' + category.slug} className={cx('inner')}>
                  {category.title}
                </Link>
              ))}
            </div>
            <Link href={`/posts/${data.slug}`}>
              <h4 className={cx('title')}>{getText(data.title, 100)}</h4>
            </Link>
            {popular && (
              <span className={cx('share')}>
                <SharedIcon style={{ marginRight: '6px' }} size={layout === 1 ? '8' : '12'} />
                {data.share || '0'}
              </span>
            )}
          </div>
        )}
      </ImgCtn>

      {popular || (
        <div className={cx('content')}>
          {list && (
            <div className={cx('category')}>
              {categories.map((category) => (
                <Category key={category._id} data={category} small={small} />
              ))}
            </div>
          )}
          {big || (
            <Link href={`/posts/${data.slug}`}>
              <h4 className={cx('title')}>{getText(data.title, 100)}</h4>
            </Link>
          )}
          {small || (
            <>
              <p className={cx('sub-title')}>{big ? data.subTitle : getText(data.subTitle, 90)}</p>
              <p className={cx('description')}>
                {getTime(data.postedAt || data.createdAt)}
                {big || ' '}
                {list || <br />}
                <span>
                  <GrView style={{ marginRight: '4px' }} className={cx('icon')} /> {data.view || '0'}
                </span>
                <span>
                  <AiOutlineLike style={{ marginRight: '4px' }} /> {data.like ? data.like.length : '0'}
                </span>
                <span>
                  <SharedIcon style={{ marginRight: '6px' }} size={layout === 1 ? '8' : '12'} /> {data.share || '0'}
                </span>
              </p>
            </>
          )}
          {big && <div className={cx('corner')}></div>}
          {!big && !list && (
            <div className={cx('category')}>
              {categories.map((category) => (
                <Category key={category._id} data={category} small={small} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(PostItem)
