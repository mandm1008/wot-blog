import Tippy from '@tippyjs/react/headless'

interface Props {
  children: JSX.Element
  className?: string
  content: React.ReactNode
  style?: React.CSSProperties
}

function OptionsPopper({ children, className, content, style }: Props) {
  return (
    <Tippy
      trigger="click"
      interactive
      appendTo={() => document.body}
      placement="right-start"
      render={(attrs) => (
        <div className={className} style={style} tabIndex={-1} {...attrs}>
          {content}
        </div>
      )}
    >
      {children}
    </Tippy>
  )
}

export default OptionsPopper
