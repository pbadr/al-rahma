import json

from quart import Quart, request, abort, make_response
from quart_cors import cors

from util import (
  get_chat_response, get_chat_stream_response, 
  ServerSentEvent, 
  config,
  create_user, delete_user,
  create_chat, add_message_to_chat, get_user_chats, get_chat_history, delete_chat_history
)

from urllib.parse import unquote

app = Quart(__name__)
app.secret_key = config['QUART_APP_SECRET']
app = cors(app, allow_origin=['http://localhost:3000', 'https://al-rahma.vercel.app', 'https://www.rahma.live'], allow_credentials=True)

from quart_auth import (
  QuartAuth, AuthUser, Unauthorized,
  login_required, login_user, logout_user,
  current_user
)

QuartAuth(app)

import os

# Print out the configuration variables to check if they're being set correctly
# print(f"QUART_AUTH_COOKIE_SAMESITE: {app.config['QUART_AUTH_COOKIE_SAMESITE']}")
# print(f"QUART_AUTH_COOKIE_SECURE: {app.config['QUART_AUTH_COOKIE_SECURE']}")

import asyncio

@app.errorhandler(Unauthorized)
async def unauthorized(*_):
  return {
    "message": "You are unauthorized to access this route"
  }, 401

@app.route('/')
@login_required
async def index():
  return {
    "message": "Hello from auth required route",
    "user_id": current_user.auth_id
  }, 200

@app.route('/chat-history', methods=['GET'])
@login_required
async def chat_history():
  user_id = current_user.auth_id
  user_chats = get_user_chats(user_id)

  return {
    "chats": user_chats
  }, 200

@app.route('/chat/<string:chat_id>', methods=['GET', 'DELETE'])
@login_required
async def chat(chat_id):
  if request.method == 'DELETE':
    chat_id = delete_chat_history(current_user.auth_id, chat_id)
    return {
      "chat_id": chat_id
    }, 200

  try:
    chat_history = get_chat_history(chat_id)
    return {
      "chat": chat_history
    }, 200
  
  except Exception:
    return {
      "chat": [],
      "error": True,
    }

import asyncio
@app.route('/sse', methods=['GET'])
@login_required
async def sse():
  if "text/event-stream" not in request.accept_mimetypes:
    abort(400)

  raw_prompt: str | None = request.args.get("prompt", None)
  if not request.args.get("prompt"):
    return {
      "error": "Please pass in a prompt"
    }, 400
  
  prompt = unquote(raw_prompt)

  chat_id: str | None = request.args.get("chatId", None)
  chat = None
  if not chat_id:
    chat = create_chat(current_user.auth_id)
    chat_id = str(chat.inserted_id)

    message = add_message_to_chat(
      chat_id, 
      {
        "role": "user",
        "content": prompt
      }
    )
    if message:
      print(f"Inserted user message to {chat_id}")
  else:
    message = add_message_to_chat(
      chat_id, 
      {
        "role": "user",
        "content": prompt
      }
    )
    if message:
      print(f"Inserted user message to {chat_id}")

  response_stream = get_chat_stream_response(chat_id, current_user.auth_id)
  async def send_events():
    assistant_message = ""
    for index, chunk_message in enumerate(response_stream):
      response_content = chunk_message
      if not chunk_message:
        message = add_message_to_chat(
          chat_id,
          {
            "role": "assistant",
            "content": assistant_message
          }
        )
        if message:
          print(f"Inserted assistant message to {chat_id}")
        response_content = "!end"

      assistant_message += response_content

      data = json.dumps({
        "index": index,
        "token": response_content,
        "chat_id": chat_id
      })

      event = ServerSentEvent(data, event='message', id=index)

      # Allow SSE to send event immediately. it's weird. I know.
      # See https://bugs.python.org/issue34476
      await asyncio.sleep(0)
      yield event.encode()
    
  response = await make_response(
    send_events(),
    {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
    },
  )
  response.timeout = None
  return response

@app.route('/login', methods=['POST'])
async def login():
  try:
    data = json.loads(await request.get_data(as_text=True))
  except json.decoder.JSONDecodeError:
    return {
      "message": "Send valid JSON data",
      "error": True
    }, 400
  
  if not "isMuslim" in data:
    return {
      "message": "Please specify whether you are a Muslim or not",
      "error": True
    }, 400
  
  is_muslim = data["isMuslim"]

  user = create_user(is_muslim)
  user_id = str(user.inserted_id)
  login_user(AuthUser(user_id), remember=True)
  
  return {
    "message": "Logged in",
    "user_id": user_id,
    "is_muslim": is_muslim
  }, 200

@app.route('/logout')
@login_required
async def logout():
  print(current_user.auth_id)
  delete_user(current_user.auth_id)

  logout_user()

  return {
    "message": "Logged out"
  }, 200

@app.route('/api', methods=['POST'])
@login_required
async def api():
  data = json.loads(await request.get_data(as_text=True))

  if not "prompt" in data:
    return {
      'message': 'Error: No prompt provided'
    }, 400

  prompt = data['prompt']
  response = get_chat_response(prompt)

  return {
    'response': response
  }, 200


if not os.environ["ENVIRONMENT"] == "PRODUCTION":
  app.run(port=5000)
