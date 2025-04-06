import { FC, memo, useEffect, useRef } from 'react'

import { useAppSelector } from '../redux/store'
import Message from './Message'

const ChatFrame: FC = memo(() => {
  console.log('.')
  const { messages } = useAppSelector((state) => state.messages)
  const firsRenderRef = useRef<boolean>(true)
  const chatFrameRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chatFrameRef.current) {
      chatFrameRef.current.scrollTop = chatFrameRef.current.scrollHeight
    }
    firsRenderRef.current = false
  }, [messages.length])

  return (
    <div
      ref={chatFrameRef}
      className={`box-border ${firsRenderRef.current && 'scroll - smooth'} flex h-full w-full grow-1 flex-col
        gap-[5px] overflow-y-auto p-[5px]`}
    >
      {messages.map((m, i) => (
        <Message key={i} message={m} />
      ))}
    </div>
  )
})

export default ChatFrame
