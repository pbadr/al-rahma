"use client";

import { ChangeEvent, FormEvent, useState } from "react"

import ChatInput from "../components/chat/ChatInput";
import ChatLog from "../components/chat/ChatLog";

interface ServerResponse {
	token: string
}

export interface ChatObject {
  role: string;
  content: string;
}


export default function Chat() {
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [prompt, setPrompt] = useState<string>('');

	const [messages, setMessages] = useState<ChatObject[]>([
		{ 'role': 'user', 'content': "hello world!" },
		{ 'role': 'assistant', 'content': "Hello! How can I assist you today on this wonderful day?\nHello! How can I assist you today on this wonderful day?" },
		{ 'role': 'user', 'content': "thanks!!" },
		
	]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>('Hello world!');

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setCurrentAssistantMessage('');

		try {
			// Set your own message on the messages list
			setMessages(previousMessages => [...previousMessages, {
				role: "user",
				content: prompt
			}]);

			await streamMessage();
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	}

	const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setPrompt(event.target.value);
	}

	async function streamMessage() {
		const promptUrlParam = encodeURIComponent(prompt);

		const eventSource = new EventSource(
			`${process.env.API_ROUTE}/sse?prompt=${promptUrlParam}`,
			{ withCredentials: true }
		)

		eventSource.onmessage = (event) => {
			const data: ServerResponse = JSON.parse(event.data);
			console.log(data);
			if (data.token === '!end') {
				eventSource.close();
				setIsLoading(false);
				
				// Set current assistant message to empty and append the finished assistant message to the messages list
				setCurrentAssistantMessage('');
				setMessages(previousMessages => [...previousMessages, {
					role: "assistant",
					content: currentAssistantMessage
				}]);

				return;
			}
			
			console.log(data.token)
			setCurrentAssistantMessage(
				previousMessage => {
					if (previousMessage === '')
						return data.token;
					
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
		<main className="p-5 appear">
			{error && 
				<span className="text-xs font-medium px-2.5 py-1 rounded bg-red-900 text-red-300">
					{error}
				</span>
			}
			<ChatLog
				currentAssistantMessage={currentAssistantMessage}
				messages={messages}
			/>
			<ChatInput
				isLoading={isLoading}
				prompt={prompt}
				handlePromptChange={handlePromptChange}
				onSubmit={onSubmit}
			/>
		</main>
	)
}
