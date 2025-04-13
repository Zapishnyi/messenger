import { createContext, FC, useMemo } from 'react'
import { Socket } from 'socket.io-client'

import { useSocket } from '../custom_hooks/useSocket'
import { useAppSelector } from '../redux/store'
import { storage } from '../services/localStorage.service'

export const SocketContext = createContext<Socket | null>(null)
const SocketProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userLogged, contactChosen, userLoggedContacts, users } = useAppSelector(
    (state) => state.users,
  )
  const { users_online } = useAppSelector((state) => state.online)
  const token = storage.getAccessToken()

  const socket = useSocket(
    token || null,
    contactChosen,
    userLogged,
    users,
    userLoggedContacts,
    users_online,
  )

  const memoizedSocket = useMemo(() => socket, [socket])

  return <SocketContext.Provider value={memoizedSocket}>{children}</SocketContext.Provider>
}

export default SocketProvider
