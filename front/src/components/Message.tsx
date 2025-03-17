import { FC, memo, useState } from "react";
import IMessage from "../interfaces/IMessage";
import { useAppSelector } from "../redux/store";
import FileComponent from "./FileComponent";
import Instruments from "./Instruments";
interface IProps {
  message: IMessage;
}
const Message: FC<IProps> = memo(({ message }) => {
  const { userLogged, contactChosen } = useAppSelector((state) => state.users);
  const { messageOnEdit } = useAppSelector((state) => state.messages);
  const isOwned = message.sender_id === userLogged?.id;
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div
      className={`${isOwned ? "self-end " : "self-start "}flex flex-col  w-fit `}
    >
      <div
        className="relative overflow-hidden w-fit"
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        <p
          className={`${isOwned ? "self-end bg-[#e4f9d5]" : "self-start bg-[#d5e1f9]"} w-fit min-w-[50px] p-[5px] rounded-md`}
        >{`${isOwned ? "You: " : contactChosen?.nick_name + ": "}${message.content}`}</p>
        {hover && message.sender_id === userLogged?.id && !messageOnEdit && (
          <Instruments edit={true} message={message} />
        )}
      </div>
      {message.files.length > 0 &&
        message.files.map((f, i) => (
          <FileComponent
            key={i}
            isOwned={isOwned}
            fileData={f}
            message={message}
          />
        ))}
    </div>
  );
});

export default Message;
