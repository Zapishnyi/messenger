import { FC } from "react";


import SignInForm from "../forms/SignIn.form";

const SignIn: FC = () => {
 
  return (
    <div className="w-full h-[80dvh] flex justify-center items-center">
      <SignInForm />
    </div>
  );
};

export default SignIn;
