import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { storage } from '../services/localStorage.service'
import UserLogged from './UserLogged/UserLogged'

const HeaderMain = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { userLogged, usersLoadingState } = useAppSelector((state) => state.users)

  useEffect(() => {
    if (!userLogged && !usersLoadingState) {
      dispatch(UsersActions.getMe())
    } else if (!userLogged && !storage.getAccessToken() && !storage.getRefreshToken()) {
      navigate('/auth/sign-in')
    }
  }, [])

  return (
    <header className={'flex h-[50px] w-full grow-0 justify-end bg-[#e8e8e8] align-middle'}>
      <UserLogged nick_name={userLogged?.nick_name || ''} />
    </header>
  )
}

export default HeaderMain
