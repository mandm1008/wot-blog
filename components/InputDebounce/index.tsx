import React, { useState, memo, forwardRef } from 'react'

function InputDebounce(props: React.InputHTMLAttributes<HTMLInputElement>, ref: any) {
  const [value, setValue] = useState('')

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const evt = new Event('search', { bubbles: true })

      ref.current.dispatchEvent(evt)
    }
  }

  return (
    <input
      ref={ref}
      value={value}
      onKeyUp={(e) => handleEnter(e)}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  )
}

export default memo(forwardRef(InputDebounce))
