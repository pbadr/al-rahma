"use client";

import "./page.css";

import { ChangeEvent, useState } from "react"

import ChatInput from "../components/chat/ChatInput";
import ChatLog from "../components/chat/ChatLog";
// import { simulateResponse } from "../utils/test";

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
	const [inputPrompt, setInputPrompt] = useState<string>('');

	const [messages, setMessages] = useState<ChatObject[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>('');

	async function onClickHandler() {
		const prompt = inputPrompt;

		setInputPrompt('');
		setIsLoading(true);
		setCurrentAssistantMessage('');

		try {
			// Set your own message on the messages list
			setMessages(previousMessages => [...previousMessages, {
				role: "user",
				content: prompt
			}]);

			await streamMessage(prompt);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	}

	const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setInputPrompt(event.target.value);
	}

	async function streamMessage(prompt: string) {
		// {
		// 	// Test streaming tokens
		// 	let newAssistantMessage = '';
		// 	for await (const token of simulateResponse()) {
		// 		setCurrentAssistantMessage(
		// 			previousMessage => {
		// 				console.log(previousMessage, newAssistantMessage)
		// 				if (previousMessage === '') {
		// 					newAssistantMessage = token;
		// 					return token;
		// 				}
		
		// 				newAssistantMessage = previousMessage + token;
		// 				return previousMessage + token;
		// 			}
		// 		)
		// 	}

		// 	console.log(newAssistantMessage);
		// 	setMessages(previousMessages => [...previousMessages, {
		// 		'role': 'assistant',
		// 		'content': newAssistantMessage
		// 	}])
		// 	setCurrentAssistantMessage('');
		// 	setIsLoading(false);
		// }

		const promptUrlParam = encodeURIComponent(prompt);

		const eventSource = new EventSource(
			`${process.env.API_ROUTE}/sse?prompt=${promptUrlParam}`,
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
				setMessages(previousMessages => [...previousMessages, {
					role: "assistant",
					content: newAssistantMessage
				}]);

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
		<main>
			{error && 
				<span className="text-xs font-medium px-2.5 py-1 rounded bg-red-900 text-red-300">
					{error}
				</span>
			}
			<div className="chatlog-container overflow-y-auto">
				<ChatLog
					currentAssistantMessage={currentAssistantMessage}
					messages={messages}
				/>
			</div>
			<div className="chatinput-container fixed bottom-0 w-full p-5 h-[130px]">
				<ChatInput
					isLoading={isLoading}
					prompt={inputPrompt}
					handlePromptChange={handlePromptChange}
					onClickHandler={onClickHandler}
				/>
			</div>
		</main>
	)
}
