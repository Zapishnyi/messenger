import { FC } from "react";
import { Socket } from "socket.io-client";
import IUser from "../interfaces/IUser";
import { UsersActions } from "../redux/Slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
interface IProps {
  socket: Socket | null;
  user: IUser;
}
const ContactItem: FC<IProps> = ({ user, socket }) => {
  const { users_online } = useAppSelector((state) => state.online);

  const online = users_online.includes(user.id)
    ? "bg-[#90f997]"
    : "bg-[#f1b7b7]";

  const dispatch = useAppDispatch();
  return (
    <div
      className={`w-full h-fit p-[5px] ${online} cursor-pointer hover:bg-[#cecdcd]`}
      onClick={() => {
        dispatch(UsersActions.setContactChosen(user));
      }}
    >
      <p>{user.nick_name}</p>
    </div>
  );
};

export default ContactItem;
