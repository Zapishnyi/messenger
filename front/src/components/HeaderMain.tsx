import { memo } from 'react'

import ContactSearchForm from '../forms/ContactSearchForm'
import { useAppSelector } from '../redux/store'
import User from './User'
import UserLogged from './UserLogged'

const HeaderMain = memo(() => {
  // console.log('.')
  const { userLogged, contactChosen } = useAppSelector((state) => state.users)
  const { users_online } = useAppSelector((state) => state.online)
  const online = users_online.includes(contactChosen?.id || '')

  return (
    <header className={'flex h-[50px] w-full grow-0 bg-[#e8e8e8] align-middle '}>
      <div className={'w-[300px] flex grow-0'}>
        <ContactSearchForm />
      </div>
      <div className={'flex grow-1 items-center justify-between'}>
        <div className={'px-[15px]'}>
          {contactChosen && <User nick_name={contactChosen?.nick_name} online={online} />}
        </div>
        <UserLogged nick_name={userLogged?.nick_name || ''} />
      </div>
    </header>
  )
})

export default HeaderMain
