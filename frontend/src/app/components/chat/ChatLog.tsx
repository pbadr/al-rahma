import "./ChatLog.css";

import { Rubik } from "next/font/google";
const rubik = Rubik({ weight: "400", subsets: ["arabic"] })

import { ChatObject } from '../../chat/page';

interface ChatLogProps {
  currentAssistantMessage: string;
  messages: ChatObject[];
}

export default function ChatLog({ currentAssistantMessage, messages }: ChatLogProps) {
  return (
    <section className="flex flex-col">
      {
        messages.map((message, index) => (
          <div
            key={index}
            className={
              `${rubik.className} whitespace-break-spaces my-2 ${message.role === 'user' ? 'user-message' : `assistant-message`} 
              ${index === messages.length - 1 && 'new-message'}
              `
            }
          >
            <p>{message.content}</p>
          </div>
        ))
      }
      {
        currentAssistantMessage &&
        <div className={`${rubik.className} whitespace-break-spaces assistant-message new-message my-2`}>
            <p>{currentAssistantMessage}</p>
          </div>
      }
    </section>
  )
}
