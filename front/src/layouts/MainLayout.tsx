import { createContext, FC, useLayoutEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Socket } from 'socket.io-client'

import ChatFrame from '../components/ChatFrame'
import ChatInput from '../components/ChatInput'
import HeaderMain from '../components/HeaderMain'
import { useSocket } from '../custom_hooks/useSocket'
import { setNavigate } from '../helpers/navigate-to'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { storage } from '../services/localStorage.service'

export const SocketContext = createContext<Socket | null>(null)
const MainLayout: FC = () => {
  console.log('.')
  const { userLogged } = useAppSelector((state) => state.users)
  const token = storage.getAccessToken()
  const socket = useSocket(token || null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  setNavigate(navigate)

  useLayoutEffect(() => {
    if (!userLogged) {
      dispatch(UsersActions.getMe())
    } else if (!userLogged && !storage.getAccessToken() && !storage.getRefreshToken()) {
      navigate('/auth/sign-in')
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      <div
        className={
          'relative flex h-[100dvh] w-[100vw] flex-col items-center justify-start overflow-hidden'
        }
      >
        <HeaderMain />
        <div className={'flex h-full w-full overflow-hidden'}>
          {/* users list */}
          <Outlet />
          {/* {contactChosen && ( */}
          <div className={'flex h-full grow-1 flex-col overflow-hidden'}>
            <ChatFrame />
            <ChatInput />
          </div>
          {/* )} */}
        </div>
      </div>
    </SocketContext.Provider>
  )
}

export default MainLayout
