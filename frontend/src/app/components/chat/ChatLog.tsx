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
          <div key={index} className={`${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
            <p>{message.content}</p>
          </div>
        ))
      }
      <div className="assistant-message">
        <p>{currentAssistantMessage}</p>
      </div>
    </section>
  )
}
