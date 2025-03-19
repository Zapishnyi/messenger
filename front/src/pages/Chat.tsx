import { FC, useEffect } from 'react'

import ContactItem from '../components/ContactItem'
import Conversation from '../components/Conversation'
import { useSocket } from '../custom_hooks/useSocket'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { storage } from '../services/localStorage.service'

const Chat: FC = () => {
  const socket = useSocket(storage.getAccessToken() || null)
  const dispatch = useAppDispatch()

  const { users_online } = useAppSelector((state) => state.online)
  const { users, userLogged, contactChosen, usersLoadingState } = useAppSelector(
    (state) => state.users,
  )
  useEffect(() => {
    dispatch(UsersActions.getAllUsers())
  }, [users_online])
  return (
    <div className={'flex h-full w-full overflow-hidden'}>
      {/* users list */}
      {!!users.length && (
        <div className={'h-full w-[300px] overflow-y-auto bg-[#e8e8e8]'}>
          {users
            .filter((u) => u.id !== userLogged?.id)
            .map((u, i) => (
              <ContactItem socket={socket} key={i} user={u} />
            ))}
        </div>
      )}
      {/* chat */}
      {contactChosen && !usersLoadingState && (
        <div className="h-full grow-1">
          <Conversation socket={socket} user_id={contactChosen?.id || ''} />
        </div>
      )}
    </div>
  )
}

export default Chat
