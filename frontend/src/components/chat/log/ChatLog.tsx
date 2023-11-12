import "./ChatLog.css";

import { Rubik } from "next/font/google";
const rubik = Rubik({ weight: "400", subsets: ["arabic"] })

import ChatSuggestion from "@/components/chat/suggestions/ChatSuggestion";
import { useEffect, createRef, Dispatch, SetStateAction } from "react";
import { Chat, ChatObject } from "@/types/chat";

interface ChatLogProps {
  currentAssistantMessage: string;
  messages: ChatObject[];
  setInputPrompt: Dispatch<SetStateAction<string>>;
  onClickHandler: () => void;
}

export default function ChatLog({ currentAssistantMessage, messages, setInputPrompt, onClickHandler }: ChatLogProps) {
  const chatLogRef = createRef<HTMLDivElement>();

  useEffect(() => {
    // Check if user currently focused on
    chatLogRef.current?.scrollIntoView();
  }, [chatLogRef]);
  

  return (
    <section className="flex flex-col">
      {
        messages && messages.length === 0 && (
          <ChatSuggestion setInputPrompt={setInputPrompt} onClickHandler={onClickHandler} />
        )
      }
      {
        messages.map((message, index) => (
          <div
            ref={chatLogRef}
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
