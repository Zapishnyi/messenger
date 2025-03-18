import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HeaderAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  useEffect(() => {
    location.pathname === "/auth/sign-in"
      ? setIsSignIn(true)
      : setIsSignIn(false);
  }, [location.pathname]);
  return (
    <header className="w-full cursor-pointer h-[10dvh] flex justify-end gap-[2vw] px-[3vw] py-[3vw]  ">
      <button
        onClick={() => {
          navigate("/auth/sign-up");
        }}
        className={` flex cursor-pointer h-fit items-center p-[5px] px-[8px] border border-gray-300 rounded-md shadow-lg ${!isSignIn ? "shadow-[#8f638a]" : "shadow-[#dadada]"} transition duration-[0.3s] hover:bg-gray-100`}
      >
        Sing up
      </button>
      <button
        onClick={() => {
          navigate("/auth/sign-in");
        }}
        className={`flex  cursor-pointer h-fit items-center p-[5px] px-[8px] border border-gray-300 rounded-md shadow-lg ${isSignIn ? "shadow-[#8f638a]" : "shadow-[#dadada]"} transition duration-[0.3s] hover:bg-gray-100 `}
      >
        Sing in
      </button>
    </header>
  );
};

export default HeaderAuth;
