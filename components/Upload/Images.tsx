import { useState, useCallback, useRef, memo } from 'react'
import useSWR from 'swr'
import Image from '~/config/image'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Upload.module.scss'
import Modal from '../Modal'
import Button from '../Button'
import { SWRServer, ImageServer } from '~/servers'
import { HiOutlineClipboardCopy } from 'react-icons/hi'
import { TbPlayerTrackPrev, TbPlayerTrackNext } from 'react-icons/tb'
import { FcRemoveImage } from 'react-icons/fc'

const cx = classNames.bind(styles)

type ModeClick = 'copy' | 'delete'

function UploadImages() {
  const [page, setPage] = useState(1)
  const { data: { images = [], totalPages = 1 } = {}, mutate } = useSWR<Apis.ApiImages.ResImages>(
    '/api/data/images?page=' + page,
    SWRServer.fetcher
  )
  const [visible, setVisible] = useState(false)
  const [isViewImage, setIsViewImage] = useState(false)
  const [dataViewImage, setDataViewImage] = useState<string[]>([])
  const [mode, setMode] = useState<ModeClick>('copy')
  const uploadImageInput = useRef<HTMLInputElement>()

  const handlerVisible = useCallback(() => setVisible(true), [])
  const handlerHidden = useCallback(() => setVisible(false), [])
  const hiddenImage = useCallback(() => setIsViewImage(false), [])

  function handleCopyLink(link: string) {
    toast.promise(
      navigator.clipboard.writeText(link),
      {
        loading: 'Coping...',
        success: 'Copied!',
        error: 'Error copy!'
      },
      { id: 'copy' }
    )
  }

  function handleHiddenCopy(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === 2) {
      e.preventDefault()
      e.stopPropagation()
      setMode('delete')
    }
  }

  async function handleDelete(image: Models.Image) {
    toast.loading('Deleting...', { id: 'delete-image' })
    const res = await ImageServer.deleteImage({ id: image._id, link: image.link })

    if (res.error) {
      toast.error(res.error, { id: 'delete-image' })
    } else {
      mutate()
      toast.success('Delete image successfully!', { id: 'delete-image' })
    }
  }

  async function uploadImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null && e.target.files.length > 0) {
      const urls: string[] = []
      toast.loading('Loading images...', { id: 'image' })
      for (const file of Array.from(e.target.files)) {
        if (file) urls.push((await getUrlImage(file)) as string)
      }
      toast.success('Loading successfully!', { id: 'image' })
      setDataViewImage(urls)
      setIsViewImage(true)
    }

    function getUrlImage(file: File): Promise<string | ArrayBuffer | null> {
      return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = () => resolve(fr.result)
        fr.onerror = () => reject('Error read image')
        file && fr.readAsDataURL(file)
      })
    }
  }

  async function handleUploadImage() {
    const body = new FormData()
    if (uploadImageInput.current?.files) {
      const files = Array.from(uploadImageInput.current.files)
      for (const index in files) {
        body.append('image' + index, files[index])
      }

      try {
        toast.loading('Uploading...', { id: 'upload' })
        const res = await fetch('/api/upload/image', {
          method: 'POST',
          body
        }).then((res) => res.json())
        if (res.error) return toast.error('Failed to be uploaded!', { id: 'upload' })
        toast.success('Upload Successfully!', { id: 'upload' })
        setIsViewImage(false)
        setDataViewImage([])
        mutate()
      } catch (e) {
        toast.error('Failed to be uploaded!', { id: 'upload' })
      }
    }
  }

  return (
    <>
      <Button primary onClick={handlerVisible}>
        Upload images
      </Button>
      <Modal visible={visible} onClickOutside={handlerHidden}>
        <div className={cx('wrapper')}>
          <label className={cx('upload')}>
            <Image src="/upload.jpg" alt="Upload" width={65} height={50} objectFit="cover" objectPosition="center" />
            <input
              ref={uploadImageInput as React.LegacyRef<HTMLInputElement>}
              onChange={uploadImages}
              type="file"
              hidden
              multiple
              accept=".jpg, .jpeg, .png, .gif, .svg, .ico"
            />
          </label>

          <div className={cx('content')}>
            {images.map((image) => (
              <div key={image._id} className={cx('image')}>
                <Image
                  src={image.link}
                  alt={image.name}
                  width={90}
                  height={55}
                  objectFit="cover"
                  objectPosition="center"
                />
                <h6>{image.name}</h6>
                <div
                  className={cx('copy', { active: mode === 'copy' })}
                  onClick={() => handleCopyLink(image.link)}
                  onMouseUp={handleHiddenCopy}
                >
                  <HiOutlineClipboardCopy />
                </div>
                <div
                  className={cx('copy', { active: mode === 'delete' })}
                  onClick={() => handleDelete(image)}
                  onMouseLeave={() => setMode('copy')}
                >
                  <FcRemoveImage />
                </div>
              </div>
            ))}
          </div>

          <div className={cx('page')}>
            <TbPlayerTrackPrev
              className={cx('icon', { disable: totalPages <= 1 })}
              onClick={totalPages <= 1 ? () => {} : () => setPage((prev) => (prev === 1 ? totalPages : prev - 1))}
            />
            {page}
            <TbPlayerTrackNext
              className={cx('icon', { disable: totalPages <= 1 })}
              onClick={totalPages <= 1 ? () => {} : () => setPage((prev) => (prev === totalPages ? 1 : prev + 1))}
            />
          </div>
        </div>

        <Modal visible={isViewImage} onClickOutside={hiddenImage}>
          <div className={cx('wrapper', 'content')}>
            {dataViewImage.map((url, i) => (
              <div key={i} className={cx('image')}>
                <Image src={url} alt="image" width={90} height={55} objectFit="cover" objectPosition="center" />
              </div>
            ))}
            <Button style={{ width: '100%' }} primary onClick={handleUploadImage}>
              Upload This
            </Button>
          </div>
        </Modal>
      </Modal>
    </>
  )
}

export default memo(UploadImages)
