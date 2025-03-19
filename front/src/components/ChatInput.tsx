import { FC, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

import { errorHandle } from '../helpers/error-handle'
import IFile from '../interfaces/IFile'
import { MessageActions } from '../redux/Slices/messageSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { api } from '../services/messenger.api.service'
import { SvgFile } from './SvgFile'
interface IProps {
  socket: Socket | null
}
const ChatInput: FC<IProps> = ({ socket }) => {
  const { userLogged, contactChosen } = useAppSelector((state) => state.users)
  const dispatch = useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { me_online } = useAppSelector((state) => state.online)
  const { messageOnEdit, filesToDelete } = useAppSelector((state) => state.messages)

  useEffect(() => {
    if (textInputRef.current) textInputRef.current.value = ''
    setSelectedFiles([])
  }, [contactChosen])

  useEffect(() => {
    if (messageOnEdit) {
      if (textInputRef.current) textInputRef.current.value = messageOnEdit.content
    }
  }, [messageOnEdit])
  const sendMessageHandle = async () => {
    if (messageOnEdit) {
      socket?.emit('edit_message', {
        content: textInputRef.current?.value || '',
        filesToDelete,
        id: messageOnEdit.id,
      })
      if (textInputRef.current) textInputRef.current.value = ''
      dispatch(MessageActions.clearFilesToDelete())
      dispatch(MessageActions.setMessageOnEdit(null))
    } else {
      try {
        let filesStore: IFile[] = []

        if (selectedFiles && selectedFiles.length > 0) {
          const formData = new FormData()

          selectedFiles.forEach((file, index) => {
            formData.append(`file`, file)
          })
          const { files } = await api.message.file_upload(formData)
          filesStore = files
        }

        if ((textInputRef.current?.value.trim() || selectedFiles.length) && socket) {
          const messageData = {
            sender_id: userLogged?.id || '',
            receiver_id: contactChosen?.id || '',
            content: textInputRef.current?.value || '',
            files: filesStore,
            created: new Date().toString(),
          }

          socket.emit('send_message', messageData)
          if (textInputRef.current) textInputRef.current.value = ''
          setSelectedFiles([])
        }
      } catch (e) {
        errorHandle(e)
      }
    }
  }
  const attachFileHandle = () => {
    if (messageOnEdit) {
      dispatch(MessageActions.setMessageOnEdit(null))
      dispatch(MessageActions.clearFilesToDelete())
      if (textInputRef.current) textInputRef.current.value = ''
    } else {
      fileInputRef.current?.click()
    }
  }

  const fileChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setSelectedFiles(Array.from(files)) // Convert FileList to an array
    }
  }

  return (
    <div className={'justify-content-end flex h-[50px] w-full gap-[5px] border border-gray-300'}>
      <input
        disabled={!me_online}
        ref={textInputRef}
        type="text"
        placeholder="Please type your message here..."
        className="flex flex-grow-1 px-[5px]"
      />

      <input
        disabled={!me_online}
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={fileChangeHandle}
        multiple
      />

      <button
        disabled={!me_online}
        onClick={attachFileHandle}
        className={`flex h-full w-[100px] flex-grow-0 cursor-pointer items-center justify-center p-[5px]
          hover:bg-gray-100`}
      >
        {!!selectedFiles.length && <SvgFile className="h-[20px]" />}
        {messageOnEdit ? 'Cancel' : 'Attach'}
      </button>

      <button
        disabled={!me_online}
        onClick={sendMessageHandle}
        className={`flex h-full w-[100px] flex-grow-0 cursor-pointer items-center justify-center p-[5px]
          hover:bg-gray-100`}
      >
        {!messageOnEdit ? '  Send' : 'Confirm'}
      </button>
    </div>
  )
}

export default ChatInput
