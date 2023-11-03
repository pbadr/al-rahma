data_path = "../dataset.jsonl"

import json

# Load the dataset
with open(data_path, 'r', encoding='utf-8') as f:
  dataset = [json.loads(line) for line in f]

# Initial dataset stats
print("Num examples:", len(dataset))
print("First example:")
for message in dataset[0]["messages"]:
  print(message)