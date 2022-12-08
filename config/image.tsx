import NextImage, { ImageProps } from 'next/image'
import { demoImage } from '~/assets/images'

function Image(props: ImageProps) {
  return <NextImage placeholder="blur" blurDataURL={demoImage.src} {...props} />
}

export default Image
