import "./ChatSuggestion.css";

import { Dispatch, SetStateAction, MouseEvent } from "react";

interface ChatSuggestionProps {
  setInputPrompt: Dispatch<SetStateAction<string>>;
  onClickHandler: () => void;
}

export default function ChatSuggestion({ setInputPrompt, onClickHandler }: ChatSuggestionProps) {
  function handleSuggestionBoxOnClick(event: MouseEvent<HTMLDivElement>) {
    let prompt = event.currentTarget.firstChild?.textContent;
    prompt = prompt?.replace(' →', '') as string;
    
    setInputPrompt(prompt);
  }

  return (
    <div>
      <div className="flex gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>
        <h2 className="text-lg font-bold mb-5">Get started with some suggestions</h2>
      </div>
      <div className="grid grid-cols-2 gap-5 text-sm">
        <div onClick={handleSuggestionBoxOnClick} className="chat-suggestion-box">
          <p>What is the meaning of life? →</p>
        </div>
        <div onClick={handleSuggestionBoxOnClick} className="chat-suggestion-box">
          <p>Can you give any Surah for health? →</p>
        </div>
        <div onClick={handleSuggestionBoxOnClick} className="chat-suggestion-box">
          <p>What are some examples of Prophet Muhammad’s teachings? →</p>
        </div>
        <div onClick={handleSuggestionBoxOnClick} className="chat-suggestion-box">
          <p>I feel lost. What do I do? →</p>
        </div>
      </div>
    </div>
  )
}

