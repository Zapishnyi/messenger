import { FC, useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'

import { useAppSelector } from '../redux/store'
import Message from './Message'
interface IProps {
  socket: Socket | null
}
const ChatFrame: FC<IProps> = ({ socket }) => {
  const { messages } = useAppSelector((state) => state.messages)

  const chatFrameRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chatFrameRef.current) {
      chatFrameRef.current.scrollTop = chatFrameRef.current.scrollHeight
    }
  }, [messages.length])

  return (
    <div
      ref={chatFrameRef}
      className={'box-border flex h-full w-full grow-1 flex-col gap-[10px] overflow-y-auto p-[5px]'}
    >
      {messages.map((m, i) => (
        <Message key={i} message={m} socket={socket} />
      ))}
    </div>
  )
}

export default ChatFrame
