import path from 'path'
const dev = process.env.NODE_ENV !== 'production'

export const isServer = typeof window === 'undefined'
export const server = dev ? 'http://localhost:3000' : 'https://writeortalk.com'
export const IMAGE_DOMAIN = 'https://images.writeortalk.com'
export const FILE_DOMAIN = 'https://files.writeortalk.com'
export const STORE_IMAGES_PATH = path.join('/', 'data', 'images')
export const STORE_FILES_PATH = path.join('/', 'data', 'files')
export const EmailLayout = (content: string) => `
<div style="background-color: rgba(0,0,0,0.3); display: flex; color: rgba(0,0,0,0.5);">
  <div style="background-color: #fff; margin: 20px auto; border-radius: 8px;">
    <div
      style="display: flex; justify-content: center; align-items: center; padding: 12px; width: calc(100% - 24px); user-select: none; color: #000; background-color: rgb(3, 3, 170); border-top-left-radius: 8px; border-top-right-radius: 8px; background-image: url('https://writeortalk.com/background-email.jpg'); background-position: center; background-repeat: no-repeat; background-size: cover;">
      <img src="https://writeortalk.com/logo2.png" alt="Write or Talk Blog" style="width: 100px; margin: auto;" />
    </div>
    <div style="padding: 12px 16px; font-family: 'Source Sans Pro',sans-serif; font-size: 16px;">
      ${content}
    </div>
  </div>
</div>
`
