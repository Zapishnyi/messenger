import { FC, useEffect } from 'react'
import { Socket } from 'socket.io-client'

import { MessageActions } from '../redux/Slices/messageSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import ChatFrame from './ChatFrame'
import ChatInput from './ChatInput'
interface IProps {
  socket: Socket | null
  user_id: string
}
const Conversation: FC<IProps> = ({ socket, user_id }) => {
  const dispatch = useAppDispatch()
  const { contactChosen } = useAppSelector((state) => state.users)
  useEffect(() => {
    dispatch(MessageActions.getMessages(user_id))
  }, [contactChosen, socket])

  return (
    <>
      {!!contactChosen && (
        <div className={'flex h-full grow-1 flex-col overflow-hidden'}>
          <ChatFrame socket={socket} />
          <ChatInput socket={socket} />
        </div>
      )}
    </>
  )
}

export default Conversation
