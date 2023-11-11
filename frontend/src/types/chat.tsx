export interface ChatContextType {
  chatHistory: Chat[]
}

export interface ChatObject {
  role: string;
  content: string;
}

export interface Chat {
  id: string;
  messages: ChatObject[];
}
