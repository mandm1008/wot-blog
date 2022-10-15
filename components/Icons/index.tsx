import Icon from './Icon'

interface Props {
  size: number | string
  style?: React.CSSProperties
}

export const SharedIcon = (props: Props) => <Icon className="share" {...props} />
export const SearchIcon = (props: Props) => <Icon className="search" {...props} />
export const UserIcon = (props: Props) => <Icon className="user" {...props} />
export const CloseIcon = (props: Props) => <Icon className="close" {...props} />
export const ArrowLeftIcon = (props: Props) => <Icon className="arrow-left" {...props} />
export const ArrowRightIcon = (props: Props) => <Icon className="arrow-right" {...props} />
export const ArrowTopIcon = ({ size, style, ...props }: Props & { size: number }) => (
  <Icon
    style={{
      width: size / 2 + 'px',
      ...style
    }}
    className="arrow-left arrow-top"
    size={size}
    {...props}
  />
)
