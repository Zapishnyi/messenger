import { FC, useState } from 'react'
import { Socket } from 'socket.io-client'

import IMessage from '../interfaces/IMessage'
import { MessageActions } from '../redux/Slices/messageSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { SvgChecked } from './SvgChecked'
import SvgDelete from './SvgDelete'
import { SvgEditPen } from './SvgEditPen'
interface IProps {
  edit: boolean
  message: IMessage
  socket: Socket | null
  file_id?: string
}
const Instruments: FC<IProps> = ({ edit, message, file_id, socket }) => {
  const { messageOnEdit } = useAppSelector((state) => state.messages)
  const [checked, setChecked] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const deleteHandle = () => {
    if (messageOnEdit) {
      setChecked(true)
      if (file_id) dispatch(MessageActions.addFileToDelete(file_id))
    } else {
      socket?.emit('delete_message', message)
    }
  }
  const editHandle = () => {
    dispatch(MessageActions.setMessageOnEdit(message))
  }
  return (
    <div
      className={`absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center
        justify-end gap-[5px] bg-[#ffffffbc] animate-fade-in`}
    >
      {edit && (
        <div onClick={editHandle}>
          <SvgEditPen />
        </div>
      )}
      {checked ? (
        <SvgChecked />
      ) : (
        <div onClick={deleteHandle}>
          <SvgDelete />
        </div>
      )}
    </div>
  )
}

export default Instruments
