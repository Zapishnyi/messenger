import { FC, useEffect, useRef } from "react";
import { useAppSelector } from "../redux/store";
import Message from "./Message";

const ChatFrame: FC = () => {
  const { messages } = useAppSelector((state) => state.messages);

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
        <Message key={i} message={m} />
      ))}
    </div>
  );
};

export default ChatFrame;
