import "./ChatLog.css";

import { UIEvent, useState } from "react";

import { Rubik } from "next/font/google";
const rubik = Rubik({ weight: "400", subsets: ["arabic"] })

import ChatSuggestion from "@/components/chat/suggestions/ChatSuggestion";
import { useEffect, createRef, Dispatch, SetStateAction, UIEventHandler } from "react";
import { ChatObject } from "@/types/chat";

interface ChatLogProps {
  currentAssistantMessage: string;
  messages: ChatObject[];
  setInputPrompt: Dispatch<SetStateAction<string>>;
  onClickHandler: () => void;
}

export default function ChatLog({ currentAssistantMessage, messages, setInputPrompt, onClickHandler }: ChatLogProps) {
  const latestAssistantMessageRef = createRef<HTMLDivElement>();

  const [scrollTop, setScrollTop] = useState(0);
  const [hasUserScrolledUp, setHasUserScrolledUp] = useState(false);

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const previousScrollTop = scrollTop;
    const container = event.currentTarget;
    setScrollTop(event.currentTarget.scrollTop);

    console.log(container.scrollTop, container.scrollHeight, container.clientHeight)
    if (container.scrollTop < previousScrollTop && currentAssistantMessage !== '') {
      setHasUserScrolledUp(true);
    }
  }

  useEffect(() => {
    if (currentAssistantMessage === '')
      setHasUserScrolledUp(false);

    if (!hasUserScrolledUp)
      latestAssistantMessageRef.current?.scrollIntoView({
        "block": "end"
      })
  }, [latestAssistantMessageRef, hasUserScrolledUp, currentAssistantMessage]);
  

  return (
    <section className="chatlog-container" onScroll={handleScroll}>
      {
        messages && messages.length === 0 && (
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
        <div ref={latestAssistantMessageRef} className={`${rubik.className} whitespace-break-spaces assistant-message new-message my-2`}>
          <p className="message" dangerouslySetInnerHTML={{__html: currentAssistantMessage}} />
        </div>
        
      }
    </section>
  )
}
