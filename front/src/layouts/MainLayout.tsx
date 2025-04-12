import { createContext, FC, useLayoutEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Socket } from 'socket.io-client'

import ChatFrame from '../components/ChatFrame'
import ChatInput from '../components/ChatInput'
import HeaderMain from '../components/HeaderMain'
import { SvgBurgerRight } from '../components/SvgComponents/SvgBurgerRight'
import { useSocket } from '../custom_hooks/useSocket'
import ContactSearchForm from '../forms/ContactSearchForm'
import { setNavigate } from '../helpers/navigate-to'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { storage } from '../services/localStorage.service'

export const SocketContext = createContext<Socket | null>(null)
const MainLayout: FC = () => {
  console.log('.')
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
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(true)

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
      <div className={'relative flex h-[100dvh] w-[100vw] overflow-hidden'}>
        <div
          className={`flex h-full ${isSearchExpanded ? 'w-[100vw]' : 'w-0'} sm:w-[300px] transition-[width] duration-300
            ease-in-out grow-0 flex-col overflow-hidden bg-[#e8e8e8]`}
        >
          <div className={'flex h-[50px] w-full align-items-center p-[5px] gap-[5px] '}>
            <ContactSearchForm />
            <SvgBurgerRight
              className={' w-[35px] cursor-pointer sm:hidden '}
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            />
          </div>

          <Outlet />
        </div>
        <div
          className={`flex h-full ${!isSearchExpanded ? 'w-[100vw]' : 'w-0'} transition-[width] duration-300 ease-in-out
            sm:grow-1 flex-col overflow-hidden bg-[#ffffff]`}
        >
          <HeaderMain menuAction={setIsSearchExpanded} />
          <div className={'flex h-full grow-1 flex-col overflow-hidden'}>
            <ChatFrame />
            <ChatInput />
          </div>
        </div>
      </div>
    </SocketContext.Provider>
  )
}

export default MainLayout
