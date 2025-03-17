import { FC } from "react";

import { SyncLoader } from "react-spinners";

interface IProps {
  loadingState: boolean;
}

const BtnLoader: FC<IProps> = ({ loadingState }) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full bg-inherit">
      <SyncLoader color={"#000303"} loading={loadingState} size={8} />
    </div>
  );
};

export default BtnLoader;
