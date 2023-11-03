data_path = "../dataset.jsonl"

from collections import defaultdict
import json

# Load the dataset
with open(data_path, 'r', encoding='utf-8') as f:
  dataset = [json.loads(line) for line in f]

# Format error checks
format_errors = defaultdict(int)

for example in dataset:
  if not isinstance(example, dict):
    format_errors["data_type"] += 1
    continue
      
  messages = example.get("messages", None)
  if not messages:
    format_errors["missing_messages_list"] += 1
    continue
      
  for message in messages:
    # Check if role and content exists in the message
    if "role" not in message or "content" not in message:
      format_errors["message_missing_key"] += 1
    
    # Check if the message has keys in the dictionary that are not supposed to be there
    if any(k not in ("role", "content", "name", "function_call") for k in message):
      format_errors["message_unrecognized_key"] += 1
    
    # Check if message has an unrecognized role
    if message.get("role", None) not in ("system", "user", "assistant", "function"):
      format_errors["unrecognized_role"] += 1
        
    content = message.get("content", None)
    function_call = message.get("function_call", None)
    
    # If message contains content of any of the roles
    if (not content and not function_call) or not isinstance(content, str):
      format_errors["missing_content"] += 1
  
  # Check if message is contains an assistant role
  if not any(message.get("role", None) == "assistant" for message in messages):
    format_errors["example_missing_assistant_message"] += 1

if format_errors:
  print("Found errors:")
  for k, v in format_errors.items():
    print(f"{k}: {v}")
else:
  print("No errors found")