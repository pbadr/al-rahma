"use client";

import { ChangeEvent, FormEvent, useState } from "react"

import { Rubik } from "next/font/google";
import ChatInput from "../components/ChatInput";

const rubik = Rubik({ weight: "400", subsets: ["arabic"] })

interface ServerResponse {
	token: string
}

export default function Chat() {
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [prompt, setPrompt] = useState<string>('');
	const [messages, setMessages] = useState<Array<string>>([]);

	const [currentMessage, setCurrentMessage] = useState<string>('');

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setCurrentMessage('');

		try {
			await streamMessage();
			
			// const response = await fetch(`${process.env.API_ROUTE}/api` as string, {
			// 	method: 'POST',
			// 	body: JSON.stringify({ prompt })
			// });

			// const data: ServerResponse = await response.json();
			// const generatedPrompt = data.response;

			// setMessages(messages => [...messages, generatedPrompt]);
		} catch (error) {
			console.error(error);
		} finally {
			// setIsLoading(false);
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
				return;
			}
			
			console.log(data.token)
			setCurrentMessage(
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
			<p className={`mt-5 text-3xl whitespace-break-spaces ${rubik.className}`}>{currentMessage}</p>
			<ChatInput
				isLoading={isLoading}
				prompt={prompt}
				handlePromptChange={handlePromptChange}
				onSubmit={onSubmit}
			/>
		</main>
	)
}