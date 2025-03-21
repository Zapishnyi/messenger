import { FC, memo, useState } from 'react'
import { Socket } from 'socket.io-client'

import IMessage from '../interfaces/IMessage'
import { useAppSelector } from '../redux/store'
import FileComponent from './FileComponent'
import Instruments from './Instruments'
interface IProps {
  message: IMessage
  socket: Socket | null
}
const Message: FC<IProps> = memo(({ message, socket }) => {
  const { userLogged, contactChosen } = useAppSelector((state) => state.users)
  const { messageOnEdit } = useAppSelector((state) => state.messages)
  const isOwned = message.sender_id === userLogged?.id
  const isEdited = message.id === messageOnEdit?.id
  const [hover, setHover] = useState<boolean>(false)

  return (
    <div
      className={`${isOwned ? `self-end bg-[#e4f9d5] ${isEdited ? 'bg-[#fbe4e4] text-[#bbbbbb]' : 'bg-[#e4f9d5]'}` : 'self-start bg-[#d5e1f9]'}
        rounded-md p-[5px] flex w-fit flex-col animate-fade-in relative `}
    >
      <div
        className={' w-fit overflow-hidden'}
        onMouseEnter={() => {
          setHover(true)
        }}
        onMouseLeave={() => {
          setHover(false)
        }}
      >
        <p
          className={`${isOwned ? 'self-end ' : 'self-start'} w-fit min-w-[50px]`}
        >{`${isOwned ? 'You: ' : contactChosen?.nick_name + ': '}${message.content}`}</p>
        {hover && message.sender_id === userLogged?.id && !messageOnEdit && (
          <Instruments edit={true} message={message} socket={socket} />
        )}
      </div>
      {message.files.length > 0 &&
        message.files.map((f, i) => (
          <FileComponent key={i} isOwned={isOwned} fileData={f} message={message} socket={socket} />
        ))}
    </div>
  )
})

export default Message
