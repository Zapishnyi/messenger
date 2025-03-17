import { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import BtnLoader from "../components/BtnLoader";
import ErrorsContainer from "../components/ErrorsContainer/ErrorsContainer";
import FormInput from "../components/FormInput/FormInput";
import { InputFieldTypeEnum } from "../enums/input-field-type.enum";
import { errorHandle } from "../helpers/error-handle";
import IUserSignIn from "../interfaces/IUserSignIn";
import { UsersActions } from "../redux/Slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { storage } from "../services/localStorage.service";
import { api } from "../services/messenger.api.service";

const SignInForm = () => {
  const [errorMessage, setErrorMassage] = useState<string[] | null>(null);
  const { register, handleSubmit } = useForm<IUserSignIn>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isPending, setIsPending] = useState(false);
  const { userLogged } = useAppSelector((state) => state.users);
  const SubmitHandler = async (credentials: IUserSignIn) => {
    setIsPending(true);
    try {
      const { tokens, user } = await api.auth.sign_in(credentials);
      storage.setAccessToken(tokens.access);
      storage.setRefreshToken(tokens.refresh);
      dispatch(UsersActions.setUser(user));
      navigate("/chat");
    } catch (e) {
      setErrorMassage(errorHandle(e).message);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <form
      className="relative box-border border border-gray-200/20 p-[20px] rounded-[10px] flex flex-col items-center gap-[20px] bg-blue-200"
      onSubmit={handleSubmit(SubmitHandler)}
    >
      <FormInput<IUserSignIn>
        register={register}
        field_name={"email"}
        field_type={InputFieldTypeEnum.TEXT}
        field_label={"Email"}
      />
      <FormInput<IUserSignIn>
        register={register}
        field_name={"password"}
        field_label={"Password"}
        field_type={InputFieldTypeEnum.PASSWORD}
      />
      <button
        className={`relative w-full flex justify-center items-center cursor-pointer bg-[#87a1e3] hover:bg-[#9cabd2] p-2 px-8 border border-gray-300 rounded-md shadow-md hover:transition duration-300`}
      >
        Login
        {isPending && <BtnLoader loadingState={isPending} />}
      </button>
      {errorMessage?.length && <ErrorsContainer errors={errorMessage} />}
    </form>
  );
};

export default SignInForm;
