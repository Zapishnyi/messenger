import { FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderMain from "../components/HeaderMain";
import { setNavigate } from "../helpers/navigate-to";

const MainLayout: FC = () => {
  const navigate = useNavigate();
  setNavigate(navigate);

  return (
    <div className="relative h-[100dvh] w-[100vw] overflow-hidden flex justify-start items-center flex-col">
      <HeaderMain />
      <Outlet />
    </div>
  );
};

export default MainLayout;
