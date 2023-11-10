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
      <div className="self-end">
        <p>Message One</p>
      </div>
      <div>
        <p>Message Two</p>
      </div>
    </section>
  )
}
