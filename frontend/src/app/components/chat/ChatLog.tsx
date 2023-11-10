import "./ChatLog.css";

import { Rubik } from "next/font/google";
const rubik = Rubik({ weight: "400", subsets: ["arabic"] })

import { ChatObject } from '../../chat/page';
import ChatSuggestion from "./ChatSuggestion";
import { Dispatch, SetStateAction } from "react";

interface ChatLogProps {
  currentAssistantMessage: string;
  messages: ChatObject[];
  setInputPrompt: Dispatch<SetStateAction<string>>;
  onClickHandler: () => void;
}

export default function ChatLog({ currentAssistantMessage, messages, setInputPrompt, onClickHandler }: ChatLogProps) {
  return (
    <section className="flex flex-col">
      {
        messages.length === 0 && (
          <ChatSuggestion setInputPrompt={setInputPrompt} onClickHandler={onClickHandler} />
        )
      }
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
            <p className="message" dangerouslySetInnerHTML={{__html: message.content}} />
          </div>
        ))
      }
      {
        currentAssistantMessage &&
        <div className={`${rubik.className} whitespace-break-spaces assistant-message new-message my-2`}>
            <p className="message" dangerouslySetInnerHTML={{__html: currentAssistantMessage}} />
          </div>
      }
    </section>
  )
}
