import { useEffect, useState, memo, useMemo } from 'react'
import { useBrowserLayoutEffect } from '~/hooks'
import classNames from 'classnames/bind'

import styles from './SlidePosts.module.scss'
import ScrollSlide from '../ScrollSlide'
import PostItem from '../PostItem'
import Loading from '../Loading'

const cx = classNames.bind(styles)

const stylePost = { width: '340px' }

function SlidePosts({ data = [], error, title }: { data: Apis.PostWithCategory[]; error?: any; title: string }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [isNext, setIsNext] = useState(true)
  const [isHover, setIsHover] = useState(false)

  const handler = useMemo(() => (isNext ? handleNext : handlePrev), [isNext])

  useBrowserLayoutEffect(() => {
    if (slideIndex < 0) setSlideIndex(data.length + slideIndex)
    if (slideIndex >= data.length) setSlideIndex(slideIndex - data.length)
  }, [data, slideIndex])

  useEffect(() => {
    const interval = !isHover ? setInterval(handler, 3000) : undefined

    return () => clearInterval(interval)
  }, [handler, isHover])

  function handleNext() {
    setSlideIndex((prev) => prev + 1)
    setIsNext(true)
  }

  function handlePrev() {
    setSlideIndex((prev) => prev - 1)
    setIsNext(false)
  }

  function renderLoading() {
    const results = []
    for (let i = 0; i < 3; i++) {
      results.push(
        <div className={cx('loading', `active-${i + 1}`)}>
          <Loading />
        </div>
      )
    }
    return results
  }

  function generationClass(i: number) {
    if (i === calcIndex(slideIndex + 0)) return 'active-1'
    if (i === calcIndex(slideIndex + 1)) return 'active-2'
    if (i === calcIndex(slideIndex + 2)) return 'active-3'
    if (i === calcIndex(slideIndex + 3)) return 'right'
    if (i === calcIndex(slideIndex - 1)) return 'left'
    return 'hide'
  }

  function calcIndex(number: number) {
    if (number < 0) return data.length + number
    if (number >= data.length) return number - data.length
    return number
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>
        <ScrollSlide size={30} sizeIcon="10" onPrev={handlePrev} onNext={handleNext} />
        <span>{title}</span>
      </div>

      <div className={cx('content')} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        {data.length <= 0 && !error && renderLoading()}
        {error && data.length <= 0 && 'Error loading data'}
        {data.length > 0 &&
          data.map((post, i) => (
            <div key={post._id} className={cx('post-item', generationClass(i))}>
              <PostItem data={post} style={stylePost} />
            </div>
          ))}
      </div>
    </div>
  )
}

export default memo(SlidePosts)
