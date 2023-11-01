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
