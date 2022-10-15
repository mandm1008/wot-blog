import { useEffect, useState, forwardRef, memo } from 'react'
import classNames from 'classnames/bind'
import styles from './SelectCategory.module.scss'

const cx = classNames.bind(styles)

interface Vi_Hi_Categories {
  visible: Models.Category[]
  hidden: Models.Category[]
}

function SelectCategory(
  { categories, selected = [] }: { categories: Vi_Hi_Categories; selected?: Models.Category[] },
  ref: any
) {
  const [selectedCategory, setSelectedCategory] = useState(selected)
  const [listCategory, setListCategory] = useState(categories)
  const [valueSelected, setValueSelected] = useState<string[]>([])

  useEffect(() => {
    if (selected.length > 0) {
      selected.forEach((item) => handleClearCategory(item._id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    setValueSelected(selectedCategory.map((item) => item._id))
  }, [selectedCategory])

  function handleClearCategory(id: string) {
    setListCategory((prev) => ({
      visible: prev.visible.filter((item) => item._id !== id),
      hidden: prev.hidden.filter((item) => item._id !== id)
    }))
  }

  function handleSelectedCategory(id: string) {
    setSelectedCategory(
      (prev) =>
        [
          ...prev,
          listCategory.visible.find((item) => item._id === id) || listCategory.hidden.find((item) => item._id === id)
        ] as Models.Category[]
    )
    handleClearCategory(id)
  }

  function handleUnSelectedCategory(id: string) {
    setListCategory((prev): Vi_Hi_Categories => {
      if (isInVisible(id)) {
        return {
          ...prev,
          visible: [...prev.visible, selectedCategory.find((item) => item._id === id)] as Models.Category[]
        }
      } else {
        return {
          ...prev,
          hidden: [...prev.hidden, selectedCategory.find((item) => item._id === id)] as Models.Category[]
        }
      }
    })

    setSelectedCategory((prev) => prev.filter((item) => item._id !== id))
  }

  function isInVisible(id: string) {
    for (const item of categories.visible) {
      if (item._id === id) return true
    }
    return false
  }

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('title')}>$ Category</h1>
      <div className={cx('container')}>
        {selectedCategory.map((item) => (
          <span key={item._id} className={cx('item')} onClick={() => handleUnSelectedCategory(item._id)}>
            {item.title} &times;
          </span>
        ))}
      </div>

      <h4 className={cx('title')}>Visible Category</h4>
      <div className={cx('container')}>
        {listCategory.visible.map((item) => (
          <span key={item._id} className={cx('item')} onClick={() => handleSelectedCategory(item._id)}>
            {item.title} +
          </span>
        ))}
      </div>

      <h4 className={cx('title')}>Hidden Category</h4>
      <div className={cx('container')}>
        {listCategory.hidden.map((item) => (
          <span key={item._id} className={cx('item')} onClick={() => handleSelectedCategory(item._id)}>
            {item.title} +
          </span>
        ))}
      </div>

      <input ref={ref} value={JSON.stringify(valueSelected)} readOnly type="text" hidden />
    </div>
  )
}

export default memo(forwardRef(SelectCategory))
