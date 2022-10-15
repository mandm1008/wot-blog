import Link, { LinkProps } from 'next/link'
import { memo } from 'react'

interface Props extends LinkProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  target?: string
  rel?: string
}

function DefaultLink({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  legacyBehavior,
  ...props
}: Props) {
  return (
    <Link
      href={href}
      as={as}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
      locale={locale}
      legacyBehavior={legacyBehavior}
    >
      <a {...props}>{children}</a>
    </Link>
  )
}

export default memo(DefaultLink)
