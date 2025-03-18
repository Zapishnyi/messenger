import { FC, useLayoutEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import HeaderAuth from "../components/HeaderAuth";
import { setNavigate } from "../helpers/navigate-to";
import { useAppSelector } from "../redux/store";
import { storage } from "../services/localStorage.service";

const AuthLayout: FC = () => {
  const navigate = useNavigate();
  setNavigate(navigate);


  const { userLogged, usersLoadingState } = useAppSelector(
    (state) => state.users
  );

  useLayoutEffect(() => {
    const accessExist = !!storage.getAccessToken();
    const refreshExist = !!storage.getRefreshToken();
    if (accessExist && refreshExist && !usersLoadingState) {
      navigate("/chat");
    }
  }, []);


  return (
    <div>
      <HeaderAuth />
      <Outlet />
    </div>
  );
}

export default AuthLayout;
