import { ChangeEvent, FormEvent } from "react"

interface ChatInputProps {
  prompt: string;
  isLoading: boolean;
  handlePromptChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function ChatInput({ prompt, isLoading, handlePromptChange, onSubmit }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <div className="flex relative">
          <textarea
            className="bg-[#18233D] text-white rounded-3xl focus:border-0 focus:outline-0 pl-5 py-3 pr-14 w-full max-h-80 overflow-auto resize-none"
            rows={1}
            name="prompt"
            value={prompt}
            onChange={handlePromptChange}
            autoComplete="off"
          />
          <button
            className={`absolute right-0 bottom-0 mr-3 mb-2 opacity-50 ${prompt.length > 0 && 'bg-secondary opacity-100'} p-1 px-2 rounded-full transition-colors`}
            disabled={isLoading || prompt.length === 0}
            type="submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <p className="text-sm mt-3 opacity-70">
          This application uses GPT-4 and the information it generates <span className="font-bold">can</span> be inaccurate.
        </p>
      </div>
    </form>
  )
}