import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

import IContact from '../interfaces/IContact'
import IMessage from '../interfaces/IMessage'
import IUser from '../interfaces/IUser'
import { MessageActions } from '../redux/Slices/messageSlice'
import { OnlineActions } from '../redux/Slices/onlineSlice'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch } from '../redux/store'

const WS_SERVER_URL = import.meta.env.VITE_BACK_BASE_URL

export const useSocket = (
  token: string | null,
  contactChosen: IContact | null,
  userLogged: IUser | null,
  users: IUser[],
  userLoggedContacts: IContact[],
  users_online: string[],
): Socket | null => {
  const socketRef = useRef<Socket | null>(null)
  const dispatch = useAppDispatch()
  const contactChosenRef = useRef<IContact | null>(contactChosen)
  const userLoggedRef = useRef<IUser | null>(userLogged)
  const usersRef = useRef<IUser[]>(users)
  const userLoggedContactsRef = useRef<IContact[]>(userLoggedContacts)
  const usersOnlineRef = useRef<string[]>(users_online)

  useEffect(() => {
    contactChosenRef.current = contactChosen
    userLoggedRef.current = userLogged
    usersRef.current = users
    userLoggedContactsRef.current = userLoggedContacts
    usersOnlineRef.current = users_online
  }, [contactChosen, userLogged, users, userLoggedContacts, users_online])

  useEffect(() => {
    if (!token) return

    socketRef.current = io(WS_SERVER_URL, {
      transports: ['websocket'],
      query: {
        token,
      },
    })

    socketRef.current.on('connect', () => {
      dispatch(OnlineActions.setMeOnline(true))
    })

    socketRef.current.on('disconnect', () => {
      dispatch(OnlineActions.setMeOnline(false))
      dispatch(OnlineActions.setUsersOnline([]))
    })

    socketRef.current.on('online-users', (usersOnline: string[]) => {
      const usersFiltered = usersOnline.filter((onlineUser) => {
        return (
          usersRef.current.some((user) => user.id === onlineUser) ||
          userLoggedContactsRef.current.some((user) => user.id === onlineUser)
        )
      })

      if (usersFiltered.length < usersOnlineRef.current.length) {
        const userDisconnected = usersOnlineRef.current.filter(
          (user) => !usersFiltered.includes(user),
        )
        dispatch(UsersActions.lastVisitStateUpdate(userDisconnected[0]))
      }
      if (usersFiltered.length !== usersOnlineRef.current.length) {
        dispatch(OnlineActions.setUsersOnline(usersFiltered))
      }
    })

    socketRef.current.on('error', (error: { message: string }) => {
      console.error('Websocket error:', error.message)
      //   navigateTo('/error', {
      //     state: [error.message],
      //   })
    })

    socketRef.current.on('receive_message', (message: IMessage) => {
      if (
        contactChosenRef.current?.id === message.sender_id ||
        userLoggedRef.current?.id === message.sender_id
      ) {
        dispatch(MessageActions.addMessage(message))
      }
      if (contactChosenRef.current?.id !== message.sender_id) {
        dispatch(MessageActions.addUnreadMessage(message))
      }
    })

    socketRef.current.on('message_edited', (message: IMessage) => {
      if (
        contactChosenRef.current?.id === message.sender_id ||
        userLoggedRef.current?.id === message.sender_id
      ) {
        dispatch(MessageActions.editMessage(message))
      }
    })

    socketRef.current.on('message_deleted', (message: IMessage) => {
      if (
        contactChosenRef.current?.id === message.sender_id ||
        userLoggedRef.current?.id === message.sender_id
      ) {
        dispatch(MessageActions.deleteMessage(message.id))
      }
      if (contactChosenRef.current?.id !== message.sender_id) {
        dispatch(MessageActions.filterUnreadMessages(message.id))
      }
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [token])

  return socketRef.current
}
