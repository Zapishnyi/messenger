import { useNavigate } from "react-router-dom";

import { UsersActions } from "../../redux/Slices/usersSlice";
import { useAppDispatch } from "../../redux/store";

import { FC, useState } from "react";
import { storage } from "../../services/localStorage.service";
import { api } from "../../services/messenger.api.service";
import SvgUser from "./SvgUser";
interface IProps {
  nick_name: string;
}
const UserLogged: FC<IProps> = ({ nick_name }) => {
  const [hover, setHover] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const clickHandle = async () => {
    try {
      await api.auth.log_out();
      storage.deleteTokens();
      dispatch(UsersActions.setUser(null));
      navigate("/auth/sign-in");
    } catch (err) {
      console.error(`Log out failed with error: ${err}`);
    }
  };
  return (
    <div
      className={
        "h-[100%] w-[250px] flex flex-col justify-between items-center cursor-pointer px-[2px]"
      }
      onClick={clickHandle}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {!!nick_name && (
        <>
          <SvgUser />
          <div className={"h-[50px] relative "}>
            {!hover ? <p>{`${nick_name}`}</p> : <p>{"Log out"}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default UserLogged;
