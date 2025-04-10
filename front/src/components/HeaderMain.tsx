import { Dispatch, FC, memo, SetStateAction } from 'react'

import { useAppSelector } from '../redux/store'
import { SvgBurgerLeft } from './SvgComponents/SvgBurgerLeft'
import User from './User'
import UserLogged from './UserLogged'
interface IProps {
  menuAction: Dispatch<SetStateAction<boolean>>
}
const HeaderMain: FC<IProps> = memo(({ menuAction }) => {
  // console.log('.')
  const { userLogged, contactChosen } = useAppSelector((state) => state.users)
  const { users_online } = useAppSelector((state) => state.online)
  const online = users_online.includes(contactChosen?.id || '')

  return (
    <header className={'flex h-[50px] w-full grow-1 bg-[#e8e8e8] justify-between items-center '}>
      <div className={'px-[15px] flex h-full w-fit items-center '}>
        {contactChosen && <User nick_name={contactChosen.nick_name} online={online} />}
      </div>
      <SvgBurgerLeft
        className={' w-[30px] self-center sm:hidden cursor-pointer'}
        onClick={() => menuAction((prev) => !prev)}
      />
      <UserLogged nick_name={userLogged?.nick_name || ''} />
    </header>
  )
})

export default HeaderMain
