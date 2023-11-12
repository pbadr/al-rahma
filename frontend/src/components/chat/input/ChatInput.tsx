import { ChangeEvent, KeyboardEvent } from "react"

interface ChatInputProps {
  prompt: string;
  isLoading: boolean;
  handlePromptChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClickHandler: () => Promise<void>;
}

export default function ChatInput({ prompt, isLoading, handlePromptChange, onClickHandler }: ChatInputProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && prompt === '') {
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onClickHandler()
    }
  }

  return (
    <form>
      <div className="mb-3 p-2 lg:p-0">
        <div className="flex relative">
          <textarea
            className="bg-[#18233D] text-white rounded-xl lg:rounded-3xl focus:border-0 focus:outline-0 pl-5 py-3 pr-14 w-full max-h-80 overflow-auto resize-none disabled:opacity-40 disabled:cursor-not-allowed"
            rows={1}
            name="prompt"
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            disabled={isLoading}
          />
          <button
            className={`absolute right-0 bottom-0 mr-3 mb-2 opacity-50 ${prompt.length > 0 && 'bg-secondary !opacity-100'} p-1 px-2 rounded-full transition-colors disabled:cursor-not-allowed`}
            disabled={isLoading || prompt.length === 0}
            onClick={() => onClickHandler()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <p className="md:text-xs text-center mt-3 px-2 opacity-70 text-[10px]">
          Al-Rahma can <b>sometimes</b> generate inaccurate information. Please remember to cross-check your answers
        </p>
      </div>
    </form>
  )
}