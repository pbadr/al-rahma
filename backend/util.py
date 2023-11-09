import json
import openai

config = json.loads(open('./config.json').read())

openai.api_key = config['OPENAI_API_KEY']
openai.organization = config['OPENAI_ORGANIZATION_ID']

def get_chat_response(prompt):
	response = openai.ChatCompletion.create(
		model="gpt-4",
		temperature=0,
		max_tokens=500,
		messages=[
			{"role": "system", "content": "You are an assistant that only responds to greetings."},
			{"role": "user", "content": prompt},
		]
	)

	return response['choices'][0]['message']['content']

def get_chat_stream_response(prompt):
	response = openai.ChatCompletion.create(
		model="gpt-4",
		temperature=0.3,
		max_tokens=500,
		messages=[
			{"role": "system", "content": "You are an assistant that only responds to greetings."},
			{"role": "user", "content": prompt},
		],
		stream=True
	)

	def process_response(response):
		for chunk in response:
			chunk_message = chunk['choices'][0]['delta']

			# If the chunk messae has a chunk response with 'assistant', move to next event
			if 'role' in chunk_message:
				continue

			if not chunk['choices'][0]['delta']:
				chunk_message = None
			else:
				chunk_message = chunk['choices'][0]['delta']['content']
			
			yield chunk_message

	return process_response(response)

from dataclasses import dataclass

@dataclass
class ServerSentEvent:
	data: str
	event: str | None = None
	id: int | None = None
	retry: int | None = None

	def encode(self) -> bytes:
		message = f"data: {self.data}"
		if self.event is not None:
			message = f"{message}\nevent: {self.event}"
		if self.id is not None:
			message = f"{message}\nid: {self.id}"
		if self.retry is not None:
			message = f"{message}\nretry: {self.retry}"
		
		message = f"{message}\r\n\r\n"
		return message.encode('utf-8')
