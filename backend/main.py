import json

from quart import Quart, request, abort, make_response
from quart_cors import cors

from util import get_chat_response, get_chat_stream_response, ServerSentEvent, config

from urllib.parse import unquote

app = Quart(__name__)
app.secret_key = config['QUART_APP_SECRET']
app = cors(app, allow_origin=['http://localhost:3000'], allow_credentials=True)

from quart_auth import (
  QuartAuth, AuthUser, Unauthorized,
  login_required, login_user, logout_user,
  current_user
)

QuartAuth(app)

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
  response_stream = get_chat_stream_response(prompt)

  async def send_events():
    for index, chunk_message in enumerate(response_stream):
      response_content = chunk_message
      if not chunk_message:
        response_content = "!end"
      
      data = json.dumps({
        "token": response_content
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

@app.route('/login')
async def login():
  login_user(AuthUser(1), remember=True)

  return {
    "message": "Logged in"
  }, 200

@app.route('/logout')
async def logout():
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

app.run(port=5000)
