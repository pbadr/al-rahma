"use client";

import { ChangeEvent, FormEvent, useState } from "react"

interface ServerResponse {
	response: string
}

export default function Chat() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [prompt, setPrompt] = useState<string>('');
	const [messages, setMessages] = useState<Array<string>>([]);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch(`${process.env.API_ROUTE}/api` as string, {
				method: 'POST',
				body: JSON.stringify({ prompt })
			});

			const data: ServerResponse = await response.json();
			const generatedPrompt = data.response;

			setMessages(messages => [...messages, generatedPrompt]);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	const handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPrompt(event.target.value);
	}

	return (
		<main className="p-5">
			<form onSubmit={onSubmit}>
				<div className="mb-3 flex flex-col">
					<label className="mb-2" htmlFor="prompt">Enter prompt</label>
					<input
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2"
						type="text"
						name="prompt"
						value={prompt}
						onChange={handlePromptChange}
						autoComplete="off"
					/>
				</div>
				<div>
					<button
						className="text-white bg-blue-700 rounded-lg hover:bg-blue-800 px-5 py-2.5 disabled:bg-blue-300 disabled:cursor-not-allowed"
						disabled={isLoading}
						type="submit"
					>
						Submit
					</button>
					<p className="text-sm mt-3 opacity-50">
						This application uses GPT-4 and the information it generates <span className="font-bold">can</span> be inaccurate.
					</p>
				</div>
			</form>
			{
				messages.map((message, index) => (
					<p key={index}>{message}</p>
				))
			}
		</main>
	)
}