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
