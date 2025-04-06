import { FC, memo, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { MessageActions } from '../redux/Slices/messageSlice'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import SvgMessage from './SvgComponents/SvgMessage'
import SvgUserMinus from './SvgComponents/SvgUserMinus'
import SvgUserPlus from './SvgComponents/SvgUserPlus'
import User from './User'
interface IProps {
  user_id: string
  nick_name: string
}
const UserItem: FC<IProps> = memo(({ nick_name, user_id }) => {
  // console.log('.')
  const location = useLocation()
  const { users_online } = useAppSelector((state) => state.online)
  const { contactChosen, userLoggedContacts } = useAppSelector((state) => state.users)
  const { unreadMessages } = useAppSelector((state) => state.messages)
  const [newMessages, setNewMessages] = useState<number>(0)
  const [contactAction, setContactAction] = useState<boolean>(false)
  const online = users_online.includes(user_id)
  const chosenMark = contactChosen?.id === user_id

  const isInContacts = userLoggedContacts?.some((c) => c.id === user_id)
  const dispatch = useAppDispatch()

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setNewMessages(unreadMessages.filter((m) => m.sender_id === user_id).length)
  }, [/*users,*/ unreadMessages])

  const contactActionHandler = () => {
    dispatch(UsersActions.contactToggle(user_id))
  }

  const contactChosenHandler = () => {
    if (contactChosen?.id !== user_id) {
      dispatch(UsersActions.setContactChosen({ nick_name, id: user_id }))
      dispatch(MessageActions.getMessages(user_id))
      dispatch(MessageActions.filterUnreadMessages(user_id))
    }
  }

  const hoverActionHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.type === 'mouseenter') {
      hoverTimeoutRef.current = setTimeout(() => {
        setContactAction(true)
      }, 500)
    } else {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      setContactAction(false)
    }
    event.stopPropagation()
  }
  return (
    <div
      className={`h-fit w-full bg-[#e8e8e8] ${ chosenMark &&
        'filter drop-shadow-[0_0_10px_rgba(0,0,0,0.25)] bg-[#c7c7c7]' } p-[5px] flex cursor-pointer
        justify-between transition duration-[0.3s] hover:bg-[#c7c7c7] overflow-hidden`}
      onMouseEnter={hoverActionHandler}
      onMouseLeave={hoverActionHandler}
    >
      <User
        online={online}
        nick_name={nick_name}
        action={contactChosenHandler}
        isInContacts={!location.pathname.includes('/contacts') ? isInContacts : undefined}
      />
      <div className={'flex gap-[5px] items-center'}>
        {contactAction && (
          <div
            onClick={contactActionHandler}
            className={
              'relative flex h-[20px] w-[20px] items-center justify-center animate-fade-in'
            }
          >
            {isInContacts ? <SvgUserMinus /> : <SvgUserPlus />}
          </div>
        )}
        {!!newMessages && (
          <div
            className={
              'relative flex h-[20px] w-[20px] items-center justify-center animate-fade-in'
            }
          >
            <SvgMessage />
            <p
              className={
                'absolute top-[8px] right-[-5px] rounded-full bg-white px-1 text-xs shadow-md'
              }
            >
              {newMessages}
            </p>
          </div>
        )}
      </div>
    </div>
  )
})

export default UserItem
