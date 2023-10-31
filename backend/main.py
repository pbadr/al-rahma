from quart import Quart

app = Quart(__name__)

@app.route('/')
async def api():
    return {
      'message': 'Hello from the backend'
    }, 200

app.run(port=5000)
