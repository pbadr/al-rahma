from quart import Quart, request

from util import get_chat_response

app = Quart(__name__)

@app.route('/api', methods=['POST'])
async def api():
  data = await request.get_json()

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
