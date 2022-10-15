import { useLayoutEffect } from 'react'
import { isServer } from '~/config/constants'

export default isServer ? () => {} : useLayoutEffect
