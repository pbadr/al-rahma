import json
import openai

config = json.loads(open('./config.json').read())

openai.api_key = config['OPENAI_API_KEY']
openai.organization = config['OPENAI_ORGANIZATION_ID']

def get_chat_response(prompt):
	response = openai.ChatCompletion.create(
		model=config['BASE_MODEL'],
		temperature=config['TEMPERATURE'],
		max_tokens=config['MAX_TOKENS'],
		messages=[
			config['SYSTEM_MESSAGE'],
			{"role": "user", "content": prompt},
		]
	)

	return response['choices'][0]['message']['content']

def get_chat_stream_response(chat_id):
	chat_history = get_chat_history(chat_id)
	messages = [config['SYSTEM_MESSAGE']] + chat_history
	
	response = openai.ChatCompletion.create(
		model=config['BASE_MODEL'],
		temperature=config['TEMPERATURE'],
		max_tokens=config['MAX_TOKENS'],
		messages=messages,
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


from pymongo.mongo_client import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection

from bson import ObjectId

uri = config['MONGODB_URI']

client = MongoClient(uri)
database: Database = client['alrahma']
user_collection: Collection = database['users']
chats_collection: Collection = database['chats']

def create_user():
	user = user_collection.insert_one({
		"chats": []
	})

	return user

def create_chat(user_id):
	chat = chats_collection.insert_one({
		"user_id": ObjectId(user_id),
		"messages": []
	})

	user_collection.find_one_and_update({"_id": ObjectId(user_id)},
		{
			'$push': { 'chats': chat.inserted_id}
		}
	)

	print("Created new chat and added to user", user_id)

	return chat

def add_message_to_chat(chat_id, message):
	chat = chats_collection.find_one({
		"_id": ObjectId(chat_id)
	})

	new_messages = chat["messages"] + [message]
	chats_collection.find_one_and_update({"_id": ObjectId(chat_id)},
		{
			'$set': { 'messages': new_messages}
		}
	)

	return message

def get_chat_history(chat_id):
	chat = chats_collection.find_one({
		"_id": ObjectId(chat_id)
	})

	chat_history = chat["messages"]
	
	return chat_history

def get_user_chats(user_id):
	user = user_collection.find_one({
		"_id": ObjectId(user_id)
	})

	user_chat_ids = user["chats"]
	chats = []
	for chat_id in user_chat_ids:
		chat = chats_collection.find_one({
			"_id": chat_id
		})
		chats.append({
			"id": str(chat['_id']),
			"messages": chat['messages']
		})

	print(chats)

	return chats

try:
	client.admin.command('ping')
	print("[util] Pinged deployment. Successfully connected to MongoDB")
	print("[util] Database:", database.name)
	print("[util] Users Collection:", user_collection.name)
	print("[util] Chats Collection:", chats_collection.name)
except Exception as e:
	print(e)
