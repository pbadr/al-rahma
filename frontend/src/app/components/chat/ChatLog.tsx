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
              `whitespace-break-spaces ${message.role === 'user' ? 'user-message' : 'assistant-message'} ${index === messages.length - 1 && 'my-3'}`
            }
          >
            <p>{message.content}</p>
          </div>
        ))
      }
      {
        currentAssistantMessage &&
          <div className="whitespace-break-spaces assistant-message mb-3">
            <p>{currentAssistantMessage}</p>
          </div>
      }
    </section>
  )
}
