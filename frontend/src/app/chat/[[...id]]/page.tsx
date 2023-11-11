"use client";

import "./page.css";

import { ChangeEvent, createRef, useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation";

import ChatInput from "@/components/chat/input/ChatInput";
import ChatLog from "@/components/chat/log/ChatLog";
import { UserContext } from "@/context/UserContext";
import { Chat, UserContextType } from "@/types/chat";
// import { simulateResponse } from "@/utils/test";

interface ServerResponse {
	token: string;
	"chat_id": string;
}

type ChatParams = {
  params: {
    id: string;
  };
};

export default function Chat({ params }: ChatParams) {
	const { getChat } = useContext(UserContext) as UserContextType;

	// Scrolling behavior
	const router = useRouter();
	const ref = createRef<HTMLDivElement>();

	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [inputPrompt, setInputPrompt] = useState<string>('');

	const [messages, setMessages] = useState<Chat[]>([]);
	const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>('');
	
	useEffect(() => {
		const fetchChat = async () => {
			const messages = await getChat(params.id);
			setMessages(messages);
		}
		if (params.id) {
			fetchChat();
		}
	}, [params, getChat]);

	async function onClickHandler() {
		const prompt = inputPrompt;

		console.log(prompt);

		setInputPrompt('');
		setIsLoading(true);
		setCurrentAssistantMessage('');

		try {
			// Set your own message on the messages list
			let newMessages = [...messages, {
				role: "user",
				content: prompt
			}] as Chat[];

			setMessages(newMessages);

			await streamMessage(prompt, newMessages);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	}

	const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setInputPrompt(event.target.value);
	}

	async function streamMessage(prompt: string, newMessages: Chat[]) {
		const promptUrlParam = encodeURIComponent(prompt);

		let chatIdUrlParam = ''
		if (params.id)
			chatIdUrlParam = `&chatId=${params.id}`
			
		const eventSource = new EventSource(
			`${process.env.API_ROUTE}/sse?prompt=${promptUrlParam}${chatIdUrlParam}`,
			{ withCredentials: true }
		)

		let newAssistantMessage = '';
		eventSource.onmessage = (event) => {
			const data: ServerResponse = JSON.parse(event.data);
			console.log('Received token:', data.token)

			if (data.token === '!end') {
				eventSource.close();
				setIsLoading(false);
				
				console.log(newAssistantMessage);
				// Set current assistant message to empty and append the finished assistant message to the messages list
				setCurrentAssistantMessage('');
				newMessages = [...newMessages, {
					role: "assistant",
					content: newAssistantMessage
				}] as Chat[];
				
				setMessages(newMessages);

				// If new chat, navigate to chatId
				if (!params.id)
					router.replace(`/chat/${data.chat_id}`)

				return;
			}
			
			setCurrentAssistantMessage(
				previousMessage => {
					if (previousMessage === '') {
						newAssistantMessage = data.token;
						return data.token;
					}
					
					newAssistantMessage = previousMessage + data.token;
					return previousMessage + data.token;
				}
			)
		}

		eventSource.onerror = (_) => {
			setError("Oops, something went wrong!");
			setIsLoading(false);
		}
	}

	return (
		<div className="chat-container">
			{error && 
				<span className="text-xs font-medium px-2.5 py-1 rounded bg-red-900 text-red-300">
					{error}
				</span>
			}
			<div ref={ref} className="chatlog-container overflow-y-auto">
				<ChatLog
					currentAssistantMessage={currentAssistantMessage}
					messages={messages}
					setInputPrompt={setInputPrompt}
					onClickHandler={onClickHandler}
				/>
			</div>
			<div className="chatinput-container fixed bottom-0">
				<ChatInput
					isLoading={isLoading}
					prompt={inputPrompt}
					handlePromptChange={handlePromptChange}
					onClickHandler={onClickHandler}
				/>
			</div>
		</div>
	)
}
