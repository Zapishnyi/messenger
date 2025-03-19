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
    <div className={`${isOwned ? 'self-end' : 'self-start'} flex w-fit flex-col`}>
      <div
        className={'relative w-fit overflow-hidden'}
        onMouseEnter={() => {
          setHover(true)
        }}
        onMouseLeave={() => {
          setHover(false)
        }}
      >
        <p
          className={`${
            isOwned
              ? `self-end ${isEdited ? 'bg-[#f9d5d5]' : 'bg-[#e4f9d5]'}`
              : 'self-start bg-[#d5e1f9]'
            } w-fit min-w-[50px] rounded-md p-[5px]`}
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
