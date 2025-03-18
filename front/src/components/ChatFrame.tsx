import { FC, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../redux/store";
import Message from "./Message";


interface IProps {
  socket: Socket | null;
}
const ChatFrame: FC<IProps> = ({socket}) => {
  const { messages } = useAppSelector((state) => state.messages);
console.log('messages',messages.length)
  const chatFrameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatFrameRef.current) {
      chatFrameRef.current.scrollTop = chatFrameRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatFrameRef}
      className="box-border w-full h-full  overflow-y-auto grow-1 flex justify-start flex-col gap-[10px] p-[5px]"
    >
      {messages.map((m, i) => (
        <Message key={i} message={m} socket={socket} />
      ))}
    </div>
  );
}

export default ChatFrame;
