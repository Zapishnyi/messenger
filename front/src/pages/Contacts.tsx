import { FC } from 'react'

import UserItem from '../components/UserItem'
import { useAppSelector } from '../redux/store'

const Contacts: FC = () => {
  console.log('.')
  const { userLoggedContacts, userLogged } = useAppSelector((state) => state.users)
  return (
    <div className={'h-full w-[300px] overflow-y-auto bg-[#e8e8e8]'}>
      {userLoggedContacts?.length &&
        userLoggedContacts
          .filter((contact) => contact.id !== userLogged?.id)
          .map(({ id, nick_name }) => <UserItem key={id} user_id={id} nick_name={nick_name} />)}
    </div>
  )
}

export default Contacts
