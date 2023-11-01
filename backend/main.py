from quart import Quart, request

app = Quart(__name__)

@app.route('/api', methods=['POST'])
async def api():
  data = await request.get_json()

  if not "prompt" in data:
    return {
      'message': 'Error: No prompt provided'
    }, 400

  prompt = data['prompt']

  return {
    'message': 'Hello from the backend'
  }, 200

app.run(port=5000)
