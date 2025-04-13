import { FC, memo, useContext, useState } from 'react'

import IMessage from '../interfaces/IMessage'
import { MessageActions } from '../redux/Slices/messageSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { SocketContext } from './SocketProvider'
import SvgDelete from './SvgComponents/SvgDelete'
import SvgEditPen from './SvgComponents/SvgEditPen'
interface IProps {
  edit: boolean
  message: IMessage
  file_id?: string
}
const Instruments: FC<IProps> = memo(({ edit, message, file_id }) => {
  const { messageOnEdit } = useAppSelector((state) => state.messages)
  const socket = useContext(SocketContext)
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
        <SvgEditPen
          className={
            'w-[30px] transform cursor-pointer transition-all duration-[0.3s] ease-in-out hover:scale-[1.2]'
          }
          onClick={editHandle}
        />
      )}

      {!checked && (
        <SvgDelete
          className={
            'w-[30px] transform cursor-pointer transition-all duration-[0.3s] ease-in-out hover:scale-[1.2]'
          }
          onClick={deleteHandle}
        />
      )}
    </div>
  )
})

export default Instruments
