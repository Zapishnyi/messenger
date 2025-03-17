import { FC, useState } from "react";

import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ErrorsContainer from "../components/ErrorsContainer/ErrorsContainer";
import FormInput from "../components/FormInput/FormInput";
import { InputFieldTypeEnum } from "../enums/input-field-type.enum";
import { errorHandle } from "../helpers/error-handle";
import IUserSignUp from "../interfaces/IUserSignUp";
import { storage } from "../services/localStorage.service";
import { api } from "../services/messenger.api.service";
import userSingUpValidator from "../validators/user-sign-up.validator";

const SingUpForm: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IUserSignUp>({
    mode: "all",
    resolver: joiResolver(userSingUpValidator),
  });
  const [errorMessage, setErrorMassage] = useState<string[] | null>(null);
  const formSubmit = async (formData: IUserSignUp) => {
    try {
      await api.auth.sign_up(formData);
      navigate("/auth/sign-in");
    } catch (e) {
      setErrorMassage(errorHandle(e).message);
    } finally {
      storage.deleteTokens();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(formSubmit)}
      className={
        "relative box-border border border-gray-200/20 p-[20px] rounded-[10px] flex flex-col items-center gap-[20px] bg-blue-200"
      }
    >
      <FormInput<IUserSignUp>
        register={register}
        field_name={"nick_name"}
        field_label={"Nick name"}
        field_type={InputFieldTypeEnum.TEXT}
        error={errors.nick_name?.message}
      />

      <FormInput<IUserSignUp>
        register={register}
        field_name={"email"}
        field_label={"Email"}
        field_type={InputFieldTypeEnum.TEXT}
        error={errors.email?.message}
      />

      <FormInput<IUserSignUp>
        register={register}
        field_name={"password"}
        field_label={"Password"}
        field_type={InputFieldTypeEnum.PASSWORD}
        error={errors.password?.message}
      />

      <button
        className={`w-full flex justify-center items-center cursor-pointer bg-[#87a1e3] hover:bg-[#9cabd2] p-2 px-8 border border-gray-300 rounded-md shadow-md hover:transition duration-300`}
        disabled={!isValid}
      >
        Submit
      </button>
      {errorMessage?.length && <ErrorsContainer errors={errorMessage} />}
    </form>
  );
};

export default SingUpForm;
