import { FC, memo } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import HeaderAuth from "../components/HeaderAuth";
import { setNavigate } from "../helpers/navigate-to";

const AuthLayout: FC = memo(() => {
  const navigate = useNavigate();
  setNavigate(navigate);
  return (
    <div>
      <HeaderAuth />
      <Outlet />
    </div>
  );
});

export default AuthLayout;
