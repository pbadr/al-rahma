import json

from quart import Quart, request
from quart_cors import cors

from util import get_chat_response

app = Quart(__name__)
app = cors(app, allow_origin='http://localhost:3000')

@app.route('/api', methods=['POST'])
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
