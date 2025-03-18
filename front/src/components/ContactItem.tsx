import { FC, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import IUser from "../interfaces/IUser";
import { MessageActions } from "../redux/Slices/messageSlice";
import { UsersActions } from "../redux/Slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { SvgMessage } from "./SvgMessage";
interface IProps {
  socket: Socket | null;
  user: IUser;
}
const ContactItem: FC<IProps> = ({ user }) => {
 
  const { users_online } = useAppSelector((state) => state.online);
  const { contactChosen } = useAppSelector((state) => state.users);
  const { unreadMessages } = useAppSelector((state) => state.messages);
  const [newMessages, setNewMessages] = useState<number>(0);
  
useEffect(() => {
  setNewMessages(unreadMessages.filter((m) => m.sender_id === user.id).length)
}, [contactChosen, unreadMessages ]);
  
  const online = users_online.includes(user.id)
    ? "bg-[#90f997]"
    : "bg-[#f1b7b7]";
  
  const chosenMark = contactChosen?.id === user.id ? "border-[1px] border-black" : "";

  const dispatch = useAppDispatch();

  const contactChosenHandler = () => {
    dispatch(UsersActions.setContactChosen(user));
    dispatch(MessageActions.filterUnreadMessages(user.id));
     }
  return (
    <div
      className={`w-full h-fit p-[5px] ${online} ${chosenMark} cursor-pointer hover:bg-[#cecdcd] flex justify-between`}
      onClick={contactChosenHandler}
    >
      <p>{user.nick_name}</p>
      {!!newMessages && <div className="w-[20px] h-[20px] flex justify-center items-center relative"><SvgMessage />
        <p className="absolute top-[8px] right-[-5px] bg-white rounded-full px-1 text-xs shadow-md">{newMessages}</p></div>}
     </div>
  );
};

export default ContactItem;
