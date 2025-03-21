import { FC, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import IUser from '../interfaces/IUser'
import { MessageActions } from '../redux/Slices/messageSlice'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { SvgMessage } from './SvgMessage'
import User from './User'
interface IProps {
  socket: Socket | null
  user: IUser
}
const ContactItem: FC<IProps> = ({ user }) => {
  const { users_online } = useAppSelector((state) => state.online)
  const { contactChosen } = useAppSelector((state) => state.users)
  const { unreadMessages } = useAppSelector((state) => state.messages)
  const [newMessages, setNewMessages] = useState<number>(0)

  useEffect(() => {
    setNewMessages(unreadMessages.filter((m) => m.sender_id === user.id).length)
  }, [contactChosen, unreadMessages])

  const online = users_online.includes(user.id)

  const chosenMark =
    contactChosen?.id === user.id ? 'border-[1px] border-black' : 'border-[1px] border-[#e8e8e8]'

  const dispatch = useAppDispatch()

  const contactChosenHandler = () => {
    dispatch(UsersActions.setContactChosen(user))
    dispatch(MessageActions.filterUnreadMessages(user.id))
  }
  return (
    <div
      className={`h-fit w-full bg-[#e8e8e8] p-[5px] ${chosenMark} flex cursor-pointer justify-between transition
        duration-[0.3s] hover:bg-[#c7c7c7]`}
      onClick={contactChosenHandler}
    >
      <User online={online} nick_name={user.nick_name} />
      {!!newMessages && (
        <div className={'relative flex h-[20px] w-[20px] items-center justify-center'}>
          <SvgMessage />
          <p
            className={
              'absolute top-[8px] right-[-5px] rounded-full bg-white px-1 text-xs shadow-md'
            }
          >
            {newMessages}
          </p>
        </div>
      )}
    </div>
  )
}

export default ContactItem
