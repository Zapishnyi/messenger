import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { errorHandle } from '../../helpers/error-handle'
import { UsersActions } from '../../redux/Slices/usersSlice'
import { useAppDispatch } from '../../redux/store'
import { storage } from '../../services/localStorage.service'
import { api } from '../../services/messenger.api.service'
import SvgUser from './SvgUser'
interface IProps {
  nick_name: string
}
const UserLogged: FC<IProps> = ({ nick_name }) => {
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
          <SvgUser />
          <div className={'relative flex h-full items-center justify-center'}>
            <p>{`${nick_name}`}</p>
            {hover && <p className="absolute top-1/2 left-[-100px] -translate-y-1/2">Log out</p>}
          </div>
        </>
      )}
    </div>
  )
}

export default UserLogged
