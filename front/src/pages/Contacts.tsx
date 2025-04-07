import { FC, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import UserItem from '../components/UserItem'
import { useAppSelector } from '../redux/store'

const Contacts: FC = () => {
  console.log('.')
  const navigate = useNavigate()
  const { userLoggedContacts, userLogged } = useAppSelector((state) => state.users)
  useLayoutEffect(() => {
    if (!userLoggedContacts.length) {
      navigate('/users')
    }
  }, [])
  return (
    <div className={'h-full w-[300px] overflow-y-auto bg-[#e8e8e8]'}>
      <p className={'text-center '}>Contacts</p>
      {!!userLoggedContacts?.length &&
        userLoggedContacts
          .filter((contact) => contact.id !== userLogged?.id)
          .map(({ id, nick_name }) => <UserItem key={id} user_id={id} nick_name={nick_name} />)}
    </div>
  )
}

export default Contacts
