import json
from sys import argv as arg

# for locking the file when working with it
import threading
file_lock = threading.Lock()

# get the id 
id = int(arg[1])

# path to the file(database :))
filepath = './vendodata.json'

# Import the json file into python object
with open(filepath) as file:
  vendodata = json.load(file)

# Initialize an empty list
updated = []

# Iterate to the data and save all except the same id
index = 1 # index for reassigning id
for data in vendodata['vendo']:
  if (id != data['id']):
    data['id'] = index
    updated.append(data)
    index += 1

# save the data to the buffer
vendodata['vendo'] = updated

print(vendodata)

# lock the file and save buffer to the file
with file_lock:
  with open(filepath, 'w') as file:
    json.dump(vendodata, file, indent=2)

print(f'data with id {id} has been deleted.')