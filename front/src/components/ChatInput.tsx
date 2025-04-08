import { FC, memo, useContext, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

import { errorHandle } from '../helpers/error-handle'
import IFile from '../interfaces/IFile'
import { SocketContext } from '../layouts/MainLayout'
import { MessageActions } from '../redux/Slices/messageSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { api } from '../services/messenger.api.service'
import SvgFile from './SvgComponents/SvgFile'

const ChatInput: FC = memo(() => {
  // console.log('.')
  const dispatch = useAppDispatch()
  const { userLogged, contactChosen } = useAppSelector((state) => state.users)
  const { messageOnEdit, filesToDelete } = useAppSelector((state) => state.messages)
  const { me_online } = useAppSelector((state) => state.online)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileTooLarge, setFileTooLarge] = useState<string[] | null>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const socket = useContext<Socket | null>(SocketContext)

  useEffect(() => {
    if (textInputRef.current) textInputRef.current.value = ''
    if (selectedFiles.length) setSelectedFiles([])
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

          selectedFiles.forEach((file) => {
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
          console.log(messageData)
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
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const filesTooLarge: string[] = []
      files.forEach((file) => {
        if (file.size > 1024 * 1024) filesTooLarge.push(file.name)
      })
      if (filesTooLarge.length) {
        setFileTooLarge(filesTooLarge)
        setTimeout(() => setFileTooLarge(null), 4000)
        e.target.value = ''
        return
      }
      setSelectedFiles(files) // Convert FileList to an array
      e.target.value = ''
    }
  }
  return (
    <div
      className={
        ' relative justify-content-end flex h-[50px] w-full gap-[5px] border border-gray-300'
      }
    >
      <input
        disabled={!me_online || !contactChosen}
        ref={textInputRef}
        type="text"
        placeholder="Please type your message here..."
        className="flex flex-grow-1 px-[5px]"
      />

      <input
        disabled={!me_online || !contactChosen}
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={fileChangeHandle}
        multiple
      />
      <div className={' h-full w-[100px] flex flex-grow-0'}>
        <button
          disabled={!me_online || !contactChosen}
          onClick={attachFileHandle}
          className={
            'flex h-full w-full cursor-pointer items-center justify-center p-[5px] hover:bg-gray-100'
          }
        >
          {!!selectedFiles.length && <SvgFile className="h-[20px]" />}
          {messageOnEdit ? 'Cancel' : 'Attach'}
        </button>
        {fileTooLarge && (
          <p
            className={`absolute top-[-50px] right-[10px] z-10 flex h-[20px]] w-fit items-center text-wrap-none
            justify-center text-[#505050] bg-[#ededede0] shadow-md px-[10px] py-[5px] rounded-[10px]
            border-[1px] border-black animate-fade-out`}
          >
            {`${fileTooLarge.length > 1 ? 'Files:' : 'File:'} ${fileTooLarge.join(', ')} size ${fileTooLarge.length > 1 ? 'are' : 'is'} more than 1mb!`}
          </p>
        )}
      </div>

      <button
        disabled={!me_online || !contactChosen}
        onClick={sendMessageHandle}
        className={`flex h-full w-[100px] flex-grow-0 cursor-pointer items-center justify-center p-[5px]
          hover:bg-gray-100`}
      >
        {!messageOnEdit ? '  Send' : 'Confirm'}
      </button>
    </div>
  )
})

export default ChatInput
