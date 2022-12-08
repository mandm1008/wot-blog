import { useState, useCallback, useRef, memo } from 'react'
import useSWR from 'swr'
import Image from '~/config/image'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Upload.module.scss'
import Modal from '../Modal'
import Button from '../Button'
import { SWRServer, FileServer } from '~/servers'
import { HiOutlineClipboardCopy } from 'react-icons/hi'
import { TbPlayerTrackPrev, TbPlayerTrackNext } from 'react-icons/tb'
import { FcFile } from 'react-icons/fc'

const cx = classNames.bind(styles)

type ModeClick = 'copy' | 'delete'

function UploadFiles() {
  const [page, setPage] = useState(1)
  const { data: { files = [], totalPages = 1 } = {}, mutate } = useSWR<Apis.ApiFiles.ResFiles>(
    '/api/data/files?page=' + page,
    SWRServer.fetcher
  )
  const [visible, setVisible] = useState(false)
  const [isViewFile, setIsViewFile] = useState(false)
  const [dataViewFile, setDataViewFile] = useState<string[]>([])
  const [mode, setMode] = useState<ModeClick>('copy')
  const uploadFileInput = useRef<HTMLInputElement>()

  const handlerVisible = useCallback(() => setVisible(true), [])
  const handlerHidden = useCallback(() => setVisible(false), [])
  const hiddenFile = useCallback(() => setIsViewFile(false), [])

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

  async function handleDelete(file: Models.File) {
    toast.loading('Deleting...', { id: 'delete-file' })
    const res = await FileServer.deleteFile({ id: file._id, link: file.link })

    if (res.error) {
      toast.error(res.error, { id: 'delete-file' })
    } else {
      mutate()
      toast.success('Delete file successfully!', { id: 'delete-file' })
    }
  }

  async function uploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null && e.target.files.length > 0) {
      const urls = []
      toast.loading('Loading files...', { id: 'files' })
      for (const file of Array.from(e.target.files)) {
        if (file) urls.push('file')
      }
      toast.success('Loading successfully!', { id: 'files' })
      setDataViewFile(urls)
      setIsViewFile(true)
    }
  }

  async function handleUploadFile() {
    const body = new FormData()
    if (uploadFileInput.current?.files) {
      const files = Array.from(uploadFileInput.current.files)
      for (const index in files) {
        body.append('file' + index, files[index])
      }

      try {
        toast.loading('Uploading...', { id: 'upload' })
        const res = await fetch('/api/upload/file', {
          method: 'POST',
          body
        }).then((res) => res.json())
        if (res.error) return toast.error('Failed to be uploaded!', { id: 'upload' })
        toast.success('Upload Successfully!', { id: 'upload' })
        setIsViewFile(false)
        setDataViewFile([])
        mutate()
      } catch (e) {
        toast.error('Failed to be uploaded!', { id: 'upload' })
      }
    }
  }

  return (
    <>
      <Button primary onClick={handlerVisible}>
        Upload files
      </Button>
      <Modal visible={visible} onClickOutside={handlerHidden}>
        <div className={cx('wrapper')}>
          <label className={cx('upload')}>
            <Image src="/upload.jpg" alt="Upload" width={65} height={50} objectFit="cover" objectPosition="center" />
            <input
              ref={uploadFileInput as React.LegacyRef<HTMLInputElement>}
              onChange={uploadFiles}
              type="file"
              hidden
              multiple
            />
          </label>

          <div className={cx('content')}>
            {files.map((file) => (
              <div key={file._id} className={cx('image')}>
                <Image
                  src="/file.png"
                  alt={file.name}
                  width={90}
                  height={55}
                  objectFit="contain"
                  objectPosition="center"
                />
                <h6>{file.name}</h6>
                <div
                  className={cx('copy', { active: mode === 'copy' })}
                  onClick={() => handleCopyLink(file.link)}
                  onMouseUp={handleHiddenCopy}
                >
                  <HiOutlineClipboardCopy />
                </div>
                <div
                  className={cx('copy', { active: mode === 'delete' })}
                  onClick={() => handleDelete(file)}
                  onMouseLeave={() => setMode('copy')}
                >
                  <FcFile />
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

        <Modal visible={isViewFile} onClickOutside={hiddenFile}>
          <div className={cx('wrapper', 'content')}>
            {dataViewFile.map((url, i) => (
              <div key={i} className={cx('image')}>
                <Image src="/file.png" alt="image" width={90} height={55} objectFit="contain" objectPosition="center" />
              </div>
            ))}
            <Button style={{ width: '100%' }} primary onClick={handleUploadFile}>
              Upload This
            </Button>
          </div>
        </Modal>
      </Modal>
    </>
  )
}

export default memo(UploadFiles)
