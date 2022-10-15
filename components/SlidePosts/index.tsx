import { useEffect, useState, useCallback, memo } from 'react'
import { useStore } from '../store'
import classNames from 'classnames/bind'

import styles from './SlidePosts.module.scss'
import ScrollSlide from '../ScrollSlide'
import PostItem from '../PostItem'
import Loading from '../Loading'

const cx = classNames.bind(styles)

function SlidePosts({ data = [], error, title }: { data: Apis.PostWithCategory[]; error?: any; title: string }) {
  const [{ layout }] = useStore()
  const [slide, setSlide] = useState(data.filter((post, i) => i < layout + 2))
  const [isAnimation, setIsAnimation] = useState(false)
  const [isNext, setIsNext] = useState(true)

  const handlePrevSlide = useCallback(() => {
    setSlide((prev) => [data[data.findIndex((post) => post._id === prev[0]._id) - 1] || data[data.length - 1], ...prev])
    setIsAnimation(true)
    setIsNext(false)
    return setTimeout(() => {
      setIsAnimation(false)
      setSlide((prev) => prev.filter((post, i) => i !== prev.length - 1))
    }, 500)
  }, [data])

  const handleNextSlide = useCallback(() => {
    setSlide((prev) => [...prev, data[data.findIndex((post) => post._id === prev[prev.length - 1]._id) + 1] || data[0]])
    setIsAnimation(true)
    setIsNext(true)
    return setTimeout(() => {
      setIsAnimation(false)
      setSlide((prev) => {
        const [stem, ...results] = prev
        return results
      })
    }, 500)
  }, [data])

  useEffect(() => {
    setSlide(data.filter((post, i) => i < layout + 2))
  }, [layout, data])
  useEffect(() => {
    let interval: NodeJS.Timer | undefined
    if (!isAnimation && data.length > 0) {
      interval = setInterval(() => {
        isNext ? handleNextSlide() : handlePrevSlide()
      }, 3000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [handleNextSlide, handlePrevSlide, isAnimation, isNext, data])

  function renderLoading() {
    const results = []
    for (let i = 0; i < layout; i++) {
      results.push(
        <div className={cx('loading')}>
          <Loading />
        </div>
      )
    }
    return results
  }

  return (
    <div className={cx('wrapper')} style={{ alignItems: layout === 3 ? 'flex-start' : 'center' }}>
      <div className={cx('title')}>
        <ScrollSlide
          size={30}
          sizeIcon="10"
          onPrev={isAnimation || data.length <= 0 ? () => {} : handlePrevSlide}
          onNext={isAnimation || data.length <= 0 ? () => {} : handleNextSlide}
        />
        <span>{title}</span>
      </div>

      <div
        className={cx('content', {
          prev: isAnimation && !isNext && layout === 3,
          next: isAnimation && isNext && layout === 3,
          prev2: isAnimation && !isNext && layout === 2,
          next2: isAnimation && isNext && layout === 2,
          prev1: isAnimation && !isNext && layout === 1,
          next1: isAnimation && isNext && layout === 1
        })}
      >
        {data.length <= 0 && !error && renderLoading()}
        {error && data.length <= 0 && 'Error loading data'}
        {data.length > 0 &&
          slide.map((post, i) => (
            <PostItem
              key={i}
              data={post}
              fadeOut={isAnimation && (isNext ? i === 1 : i === slide.length - 2)}
              fadeIn={isAnimation && (isNext ? i === slide.length - 2 : i === 1)}
              transRight={isAnimation && isNext && i === 1}
              transLeft={isAnimation && !isNext && i === slide.length - 2}
              style={{
                marginLeft: layout === 3 && i === 0 ? -340 : 0 + 'px',
                opacity: i === 0 || i === slide.length - 1 ? '0' : '1',
                pointerEvents: i === 0 || i === slide.length - 1 ? 'none' : undefined
              }}
            />
          ))}
      </div>
    </div>
  )
}

export default memo(SlidePosts)
