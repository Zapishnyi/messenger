import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import IMessage from '../interfaces/IMessage'
import IUser from '../interfaces/IUser'
import { MessageActions } from '../redux/Slices/messageSlice'
import { OnlineActions } from '../redux/Slices/onlineSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'

const WS_SERVER_URL = import.meta.env.VITE_WS_BASE_URL

export const useSocket = (token: string | null): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const dispatch = useAppDispatch()
  const { contactChosen, userLogged } = useAppSelector((state) => state.users)

  const contactChosenRef = useRef<IUser>(contactChosen)
  const userLoggedRef = useRef<IUser>(userLogged)

  useEffect(() => {
    contactChosenRef.current = contactChosen
    userLoggedRef.current = userLogged
  }, [contactChosen, userLogged])

  useEffect(() => {
    if (!token) return

    const newSocket = io(WS_SERVER_URL, {
      transports: ['websocket'],
      query: {
        token,
      },
    })

    newSocket.on('connect', () => {
      dispatch(OnlineActions.setMeOnline(true))
    })

    newSocket.on('disconnect', () => {
      dispatch(OnlineActions.setMeOnline(false))
      dispatch(OnlineActions.setUsersOnline([]))
    })
    setSocket(newSocket)

    newSocket.on('online-users', (users: string[]) => {
      dispatch(OnlineActions.setUsersOnline(users))
    })

    newSocket.on('error', (error: { message: string }) => {
      console.error('Websocket error:', error.message)
      //   navigateTo('/error', {
      //     state: [error.message],
      //   })
    })

    newSocket.on('receive_message', (message: IMessage) => {
      if (
        contactChosenRef.current?.id === message.sender_id ||
        userLoggedRef?.current?.id === message.sender_id
      ) {
        dispatch(MessageActions.addMessage(message))
      }
      if (contactChosenRef.current?.id !== message.sender_id) {
        dispatch(MessageActions.addUnreadMessage(message))
      }
    })

    newSocket.on('message_edited', (message: IMessage) => {
      if (
        contactChosenRef.current?.id === message.sender_id ||
        userLoggedRef?.current?.id === message.sender_id
      ) {
        dispatch(MessageActions.editMessage(message))
      }
    })

    newSocket.on('message_deleted', (message: IMessage) => {
      if (
        contactChosenRef.current?.id === message.sender_id ||
        userLoggedRef?.current?.id === message.sender_id
      ) {
        dispatch(MessageActions.deleteMessage(message.id))
      }
      if (contactChosenRef.current?.id !== message.sender_id) {
        dispatch(MessageActions.filterUnreadMessages(message.id))
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [token])

  return socket
}
