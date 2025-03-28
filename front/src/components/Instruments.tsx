import { FC, useState } from 'react'
import { Socket } from 'socket.io-client'

import IMessage from '../interfaces/IMessage'
import { MessageActions } from '../redux/Slices/messageSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
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
      className={`absolute
        ${checked ? 'w-full h-[1px] bg-[#000000] top-1/2 left-0 right-0 translate-y-[-50%]' : 'top-[2px] h-fit w-fit right-[0px] bg-[#ffffffc8]'}
        rounded-full flex justify-evenly items-center text-[#000000] [&>*]:p-[5px] animate-fade-in`}
    >
      {edit && (
        <div onClick={editHandle}>
          <SvgEditPen />
        </div>
      )}

      {!checked && (
        <div onClick={deleteHandle}>
          <SvgDelete />
        </div>
      )}
    </div>
  )
}

export default Instruments
