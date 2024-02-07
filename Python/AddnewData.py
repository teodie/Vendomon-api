from Remotelingparser import GetRemoteLink
from getsales import getsales
from ScrapeOtherdata import get_otherdata
import json
import requests
from sys import argv as arg

import threading
lock_file = threading.Lock()

jsonfilepath = './vendodata.json'

print(arg[1], arg[2], arg[3], arg[4], arg[5])

name = arg[1]

email = arg[2]
password = arg[3]

uname = arg[4]
passw = arg[5]

remote_link = arg[6]

with open(jsonfilepath) as jsonfile:
  ''' 
  Get the json file so that it will be converted to python (https://docs.python.org/3/library/json.html)
  JSON        --     Python

  object      --     dict
  array       --     list
  string      --     str
  number(int) --     int
  number (real)--    float
  true        --     True
  false       --     False
  null        --     None
  '''
  vendodata = json.load(jsonfile)


id = len(vendodata['vendo']) + 1

newdata = {'remote_link': remote_link, 'name': name.replace('-', ' '),'dash_uname': uname, 'dash_pass': passw, 'ng_email': email,'ng_pass':password, 'daily_sales': '0.00', 'device_temp': '?', 'online_users': '0','status': 'ok', 'id': id}

# New list for the new data
newjson = []

# This will loop through all the data and append it with the new list
for data in range(len(vendodata['vendo'])):
  newjson.append(vendodata['vendo'][data])

# append the new data
newjson.append(newdata)

# save the new list of data
vendodata['vendo'] = newjson


with lock_file:
  with open(jsonfilepath, 'w') as jsonfile:
    json.dump(vendodata, jsonfile, indent=2)

print("New data saved!")
