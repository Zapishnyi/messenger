import { FC, memo, useRef } from 'react'

import { errorHandle } from '../helpers/error-handle'
import IFile from '../interfaces/IFile'
import IMessage from '../interfaces/IMessage'
import { useAppSelector } from '../redux/store'
import { api } from '../services/messenger.api.service'
import Instruments from './Instruments'
import SvgFile from './SvgComponents/SvgFile'

interface IProps {
  isOwned: boolean
  fileData: IFile
  message: IMessage
}
const FileComponent: FC<IProps> = memo(({ fileData, isOwned, message }) => {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)
  const { messageOnEdit } = useAppSelector((state) => state.messages)
  const fileDownloadHandle = async () => {
    try {
      const response = await api.message.file_download(fileData.file_id)

      const blob = new Blob([response], {
        type: response.type || 'application/octet-stream',
      })
      const url = window.URL.createObjectURL(blob)

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url
        downloadLinkRef.current.download = fileData.file_name || 'download'
        downloadLinkRef.current.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (e) {
      errorHandle(e)
    }
  }
  return (
    <div className={`flex gap-2 ${isOwned ? 'self-end' : 'self-start'} relative`}>
      <button className="flex cursor-pointer" onClick={fileDownloadHandle}>
        {isOwned ? (
          <>
            <p>{fileData.file_name}</p>
            <SvgFile className="h-[20px]" />{' '}
          </>
        ) : (
          <>
            <SvgFile className="h-[20px]" />
            <p>{fileData.file_name}</p>
          </>
        )}
      </button>
      <a ref={downloadLinkRef} style={{ display: 'none' }}></a>
      {message?.id === messageOnEdit?.id && messageOnEdit && (
        <Instruments edit={false} message={message} file_id={fileData.file_id} />
      )}
    </div>
  )
})

export default FileComponent
