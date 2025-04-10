import { FC } from 'react'

import UserItem from '../components/UserItem'
import { HelpersActions } from '../redux/Slices/helpersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'

const Users: FC = () => {
  // console.log('.')
  const dispatch = useAppDispatch()
  const { users, userLogged } = useAppSelector((state) => state.users)

  return (
    <div
      className={'h-full w-full overflow-y-auto bg-[#e8e8e8]'}
      onFocus={() => dispatch(HelpersActions.setUsersOnFocus(true))}
      onBlur={() => dispatch(HelpersActions.setUsersOnFocus(false))}
      tabIndex={-1}
    >
      <p className={'text-center '}>Users</p>
      {!!users.length &&
        users
          .filter((user) => user.id !== userLogged?.id)
          .map((user) => <UserItem key={user.id} user_id={user.id} nick_name={user.nick_name} />)}
    </div>
  )
}

export default Users
