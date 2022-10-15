import { useState, useCallback, useRef, memo, useEffect } from 'react'
import classNames from 'classnames/bind'

import styles from './SearchBtn.module.scss'
import Button from '../Button'
import InputDebounce from '../InputDebounce'
import { SearchIcon, CloseIcon } from '../Icons'

const cx = classNames.bind(styles)
const func = () => {}

interface Props {
  page: number
  open: boolean
  onClose: () => void
  onOpen: () => void
}

function SearchBtn({ page, open, onClose = func, onOpen = func }: Props) {
  const [isSearch, setIsSearch] = useState(open)
  const inputElement = useRef<HTMLInputElement>()

  const handleToggleSearch = useCallback(() => {
    setIsSearch((prev) => !prev)
    if (isSearch) {
      setTimeout(onClose, 400)
    } else {
      setTimeout(onOpen, 400)
    }
  }, [isSearch, onClose, onOpen])
  const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])
  const preventDefault = useCallback((e: React.KeyboardEvent) => e.preventDefault(), [])

  useEffect(() => {
    if (open && page === 1 && inputElement.current) {
      inputElement.current.focus()
    }
  }, [open, page])

  return (
    <Button
      className={cx('search', { active: isSearch })}
      primary
      onClick={handleToggleSearch}
      onKeyUp={preventDefault}
    >
      <SearchIcon size="12" style={{ color: isSearch ? '#000' : '#fff', zIndex: 9 }} />
      <InputDebounce
        ref={inputElement}
        type="text"
        className={cx('input-search')}
        onClick={isSearch ? stopPropagation : func}
        style={{ cursor: isSearch ? 'default' : 'pointer' }}
      />
      {!isSearch && 'Search'}
      <span
        className={cx('close')}
        onClick={(e) => {
          stopPropagation(e)
          handleToggleSearch()
        }}
      >
        <CloseIcon size="12" style={{ color: '#000', zIndex: 9 }} />
      </span>
    </Button>
  )
}

export default memo(SearchBtn)
