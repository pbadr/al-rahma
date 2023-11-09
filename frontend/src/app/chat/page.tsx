"use client";

import { ChangeEvent, FormEvent, useState } from "react"

import { Rubik } from "next/font/google";

const rubik = Rubik({ weight: "400", subsets: ["arabic"] })

interface ServerResponse {
	token: string
}

export default function Chat() {
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
	}

	return (
		<main className="p-5 appear">
			<form onSubmit={onSubmit}>
				<div className="mb-3 flex flex-col">
					<label className="mb-2" htmlFor="prompt">Enter prompt</label>
					<textarea
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2"
						name="prompt"
						value={prompt}
						onChange={handlePromptChange}
						autoComplete="off"
					/>
				</div>
				<div>
					<button
						className="button"
						disabled={isLoading}
						type="submit"
					>
						Submit
					</button>
					<p className="text-sm mt-3 opacity-70">
						This application uses GPT-4 and the information it generates <span className="font-bold">can</span> be inaccurate.
					</p>
				</div>
			</form>
			<p className={`mt-5 text-3xl whitespace-break-spaces ${rubik.className}`}>{currentMessage}</p>
		</main>
	)
}