import { FC } from "react";
import ErrorItem from "./ErrorItem";

interface IProps {
  errors: string[] | string;
}

const ErrorsContainer: FC<IProps> = ({ errors }) => {
  return (
    <div
      className={
        "bg-white absolute w-fit-content border border-gray-200/20 p-[20px] rounded-[10px] flex gap-[30px] text-red left-1/2 bottom-[-10px] -translate-x-1/2 translate-y-full whitespace-nowrap z-101 select-none"
      }
    >
      <div>
        <p>Errors list:</p>
      </div>
      <ul className={"flex flex-col text-red-500"}>
        {Array.isArray(errors) ? (
          errors.map((e, i) => <ErrorItem key={i} errorMessage={e} />)
        ) : (
          <ErrorItem errorMessage={errors} />
        )}
      </ul>
    </div>
  );
};

export default ErrorsContainer;
