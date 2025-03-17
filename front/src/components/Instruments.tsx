import { FC, useState } from "react";
import { MessageActions } from "../redux/Slices/messageSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

import IMessage from "../interfaces/IMessage";
import { SvgChecked } from "./SvgChecked";
import SvgDelete from "./SvgDelete";
import { SvgEditPen } from "./SvgEditPen";
interface IProps {
  edit: boolean;
  message: IMessage;
  file_id?: string;
}
const Instruments: FC<IProps> = ({ edit, message, file_id }) => {
  const { messageOnEdit } = useAppSelector((state) => state.messages);
  const [checked, setChecked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const deleteHandle = () => {
    if (messageOnEdit) {
      setChecked(true);
      if (file_id) dispatch(MessageActions.addFileToDelete(file_id));
    } else {
      dispatch(MessageActions.deleteMessage(message.id));
    }
  };
  const editHandle = () => {
    dispatch(MessageActions.setMessageOnEdit(message));
  };
  return (
    <div
      className={
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ffffffbc] flex justify-end items-center gap-[5px] "
      }
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
  );
};

export default Instruments;
