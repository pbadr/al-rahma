import json
import openai

import os

if os.environ["ENVIRONMENT"] == "PRODUCTION":
	config = {
		"MONGODB_URI": os.environ['MONGODB_URI'],
		"OPENAI_ORGANIZATION_ID": os.environ['OPENAI_ORGANIZATION_ID'],
		"OPENAI_API_KEY": os.environ['OPENAI_API_KEY'],
		"QUART_APP_SECRET": os.environ['QUART_APP_SECRET'],
		"BASE_MODEL": os.environ['BASE_MODEL'],
		"SYSTEM_MESSAGE": json.loads(os.environ['SYSTEM_MESSAGE']),
		"NON_MUSLIM_PROMPT_LINE": os.environ['NON_MUSLIM_PROMPT_LINE'],
		"TEMPERATURE": 0.25,
		"MAX_TOKENS": 1000
	}
else:
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

def get_chat_stream_response(chat_id, user_id):
	print("Generating stream response for", user_id)
	is_muslim = is_user_muslim(user_id)

	print("Detected", user_id, "Muslim status:", is_muslim)

	system_message: dict = config['SYSTEM_MESSAGE']

	# If user is not Muslim, insert the non-Muslim line
	if not is_muslim:
		system_message_content: str = system_message['content']
		system_message_content_split = system_message_content.split("\n\n")

		# Insert the line at 3rd (start_index - 1) line
		system_message_content_split.insert(2, config['NON_MUSLIM_PROMPT_LINE'])
		system_message_content = "\n\n".join(system_message_content_split)

		system_message["content"] = system_message_content

	chat_history = get_chat_history(chat_id)
	messages = [system_message] + chat_history
	
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

def create_user(is_muslim: bool):
	user = user_collection.insert_one({
		"is_muslim": is_muslim,
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

def delete_chat_history(user_id, chat_id):
	user_collection.find_one_and_update({"_id": ObjectId(user_id)}, 
		{
			'$pull': { 'chats': ObjectId(chat_id) }
		}
	)

	chats_collection.find_one_and_delete({
		"_id": ObjectId(chat_id)
	})

	return chat_id

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

	return chats

def is_user_muslim(user_id):
	print("Getting user...", user_id)
	user = user_collection.find_one({
		"_id": ObjectId(user_id)
	})

	if user:
		return user["is_muslim"]

def delete_user(user_id):
	print("Deleting user...", user_id)
	user = user_collection.find_one({
		"_id": ObjectId(user_id)
	})

	chat_ids = user["chats"]
	for chat_id in chat_ids:
		chat = chats_collection.find_one_and_delete({
			"_id": ObjectId(chat_id)
		})

		print("Deleted chat", chat["_id"], "from user", user_id)

	user = user_collection.find_one_and_delete({ "_id": ObjectId(user_id )})
	print("Deleted user")

	return user


try:
	client.admin.command('ping')
	print("[util] Pinged deployment. Successfully connected to MongoDB")
	print("[util] Database:", database.name)
	print("[util] Users Collection:", user_collection.name)
	print("[util] Chats Collection:", chats_collection.name)
except Exception as e:
	print(e)
