import { FC, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import SignInForm from "../forms/SignIn.form";
import { useAppSelector } from "../redux/store";
import { storage } from "../services/localStorage.service";

const SignIn: FC = () => {


  const navigate = useNavigate();
  const { userLogged, usersLoadingState } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    const accessExist = !!storage.getAccessToken();
    const refreshExist = !!storage.getRefreshToken();
    if (accessExist && refreshExist && userLogged && !usersLoadingState) {
      // navigate("/chat");
    }
  }, []);

  return (
    <div className="w-full h-[80dvh] flex justify-center items-center">
      <SignInForm />
    </div>
  );
};

export default SignIn;
