import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { errorHandle } from '../helpers/error-handle'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { storage } from '../services/localStorage.service'
import { api } from '../services/messenger.api.service'
import User from './User'
interface IProps {
  nick_name: string
}
const UserLogged: FC<IProps> = ({ nick_name }) => {
  const { me_online } = useAppSelector((state) => state.online)
  const [hover, setHover] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const clickHandle = async () => {
    try {
      await api.auth.log_out()
      storage.deleteTokens()
      dispatch(UsersActions.setUser(null))
      navigate('/auth/sign-in')
    } catch (e) {
      errorHandle(e)
    }
  }
  return (
    <div
      className={
        'flex h-[100%] w-fit cursor-pointer items-center justify-center gap-[5px] px-[15px]'
      }
      onClick={clickHandle}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
    >
      {!!nick_name && (
        <>
          <div className={'relative flex h-full items-center justify-center'}>
            <User nick_name={nick_name} online={me_online} />
            {hover && (
              <p className="absolute top-1/2 left-[-65px] -translate-y-1/2 animate-fade-in">
                Log out
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default UserLogged
