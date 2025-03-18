import { FC } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import ErrorsContainer from "../components/ErrorsContainer/ErrorsContainer";


const ErrorPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
 

  const errors = location.state;
   console.log(errors)
  const clickHandle = () => {
    navigate("/chat");
  };
  return (
    <div className="relative h-[100dvh] w-[100vw] flex justify-center items-center flex-col">
      <div className="relative flex justify-center items-center flex-col gap-4">
        <h1>Ups, something went wrong!</h1>
        <div
          onClick={clickHandle}
          className={
            "w-fit cursor-pointer p-[5px] border border-gray-300 rounded-md shadow-md hover:bg-gray-100"
          }
        >
          <p>Return to main page</p>
        </div>
        {errors?.length && <ErrorsContainer errors={errors} />}
      </div>
    </div>
  );
};

export default ErrorPage;
