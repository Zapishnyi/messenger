import { FC, memo, useContext, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

import { errorHandle } from '../helpers/error-handle'
import IFile from '../interfaces/IFile'
import { SocketContext } from '../layouts/MainLayout'
import { MessageActions } from '../redux/Slices/messageSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { api } from '../services/messenger.api.service'
import { SvgAttachment } from './SvgComponents/SvgAttachment'
import { SvgAttachmentCheck } from './SvgComponents/SvgAttachmentChecked'
import { SvgCheck } from './SvgComponents/SvgCheck'
import SvgCross from './SvgComponents/SvgCross'
import { SvgSend } from './SvgComponents/SvgSend'

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
  const isInputEmpty = useState<boolean>(true)

  useEffect(() => {
    cancelHandle()
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
      cancelHandle()
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

          socket.emit('send_message', messageData)
          cancelHandle()
        }
      } catch (e) {
        errorHandle(e)
      }
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

  const cancelHandle = () => {
    if (textInputRef.current?.value) textInputRef.current.value = ''
    if (filesToDelete) dispatch(MessageActions.clearFilesToDelete())
    if (selectedFiles.length) setSelectedFiles([])
    if (messageOnEdit) dispatch(MessageActions.setMessageOnEdit(null))
    if (!isInputEmpty[0]) isInputEmpty[1](true)
  }
  const inputWatcher = () => {
    if (textInputRef.current?.value && isInputEmpty[0]) {
      isInputEmpty[1](false)
    } else if (!textInputRef.current?.value && !isInputEmpty[0]) {
      isInputEmpty[1](true)
    }
  }
  return (
    <div className={' relative justify-content-end flex h-[50px] w-full border border-gray-300'}>
      <input
        className={`flex h-full w-full grow-1 px-[10px] 'bg-[#ffffff]'} focus:outline-none focus:ring-0
          focus:border-none`}
        disabled={!me_online || !contactChosen}
        onChange={inputWatcher}
        ref={textInputRef}
        type="text"
        placeholder="Please type your message here..."
      />

      <input
        disabled={!me_online || !contactChosen}
        ref={fileInputRef}
        type="file"
        className={'hidden'}
        onChange={fileChangeHandle}
        multiple
      />

      <div className={' h-full w-fit flex grow-0'}>
        {me_online &&
          contactChosen &&
          (!isInputEmpty[0] || !!selectedFiles.length || messageOnEdit) && (
            <button
              className={`flex h-full w-[50px] cursor-pointer shrink-0 grow-0 items-center justify-center p-[5px]
              hover:bg-gray-100 animate-fade-in`}
              onClick={cancelHandle}
            >
              <SvgCross className="h-[20px]" />
            </button>
          )}

        {!messageOnEdit && (
          <button
            disabled={!me_online || !contactChosen}
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click()
            }}
            className={`flex h-full w-[50px] cursor-pointer shrink-0 grow-0 items-center justify-center p-[5px]
            hover:bg-gray-100 animate-fade-in`}
          >
            {!!selectedFiles.length ? (
              <SvgAttachmentCheck className="h-[30px]" />
            ) : (
              <SvgAttachment className="h-[30px]" />
            )}
          </button>
        )}
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
        className={`flex h-full w-[50px] cursor-pointer shrink-0 grow-0 items-center justify-center p-[5px]
          hover:bg-gray-100`}
      >
        {!messageOnEdit ? <SvgSend className="h-[30px]" /> : <SvgCheck className="h-[30px]" />}
      </button>
    </div>
  )
})

export default ChatInput
