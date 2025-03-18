import { FC, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import IUser from "../interfaces/IUser";
import { MessageActions } from "../redux/Slices/messageSlice";
import { UsersActions } from "../redux/Slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { SvgUserAvatar } from './SvgAvatar';
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
   
  
  const chosenMark = contactChosen?.id === user.id ? "border-[1px] border-black" : "border-[1px] border-[#e8e8e8]";

  const dispatch = useAppDispatch();

  const contactChosenHandler = () => {
    dispatch(UsersActions.setContactChosen(user));
    dispatch(MessageActions.filterUnreadMessages(user.id));
     }
  return (
    <div
      className={`w-full h-fit p-[5px] bg-[#e8e8e8] ${chosenMark} cursor-pointer hover:bg-[#c7c7c7] transition duration-[0.3s] flex justify-between`}
      onClick={contactChosenHandler}
    >
      <div className="flex gap-[10px] items-start">
        <div className="relative">
          <SvgUserAvatar />
           {online && <div className="absolute bottom-0 right-[-2px] w-[10px] h-[10px] bg-[#90f997] rounded-full"></div>}
        </div>
        <p>{user.nick_name}</p>
      
      </div>
         {!!newMessages && <div className="w-[20px] h-[20px] flex justify-center items-center relative"><SvgMessage />
        <p className="absolute top-[8px] right-[-5px] bg-white rounded-full px-1 text-xs shadow-md">{newMessages}</p></div>}
     </div>
  );
};

export default ContactItem;
