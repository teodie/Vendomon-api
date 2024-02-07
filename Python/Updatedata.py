'''
This script do the following:
1. Open the json file where data has been saved
2. Loop through all the vendo object
'''

from Remotelingparser import GetRemoteLink
from getsales import getsales
from ScrapeOtherdata import get_otherdata
import json
import requests

# This threading is imported to lock the file so that no other process will update when its already in use
import threading
file_lock = threading.Lock()

jsonfilepath = '../vendodata.json'


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

def Checkdata():
  #Loop through all data
  for vendo in vendodata['vendo']:
    print("Starting update for:", vendo['name'])

    # Dashboard Credentials
    remotelink = vendo['remote_link']
    uname = vendo["dash_uname"]
    pwd = vendo["dash_pass"]

    # Ngrok Credentials
    email = vendo['ng_email']
    password = vendo['ng_pass']

    # Test if the saved remote link is working
    response = requests.get(remotelink + '/admin/')
    
    if (response.status_code != 200):

      # This block of code will try to connect to the vendo
      print("Failed to load the saved remonte link \nParsing new link..")
      remlink = GetRemoteLink(email, password)

      print("remote_link: ", remlink)

      if(remlink == "Error"):
        # If it fails it will update the status on the json file as not ok "nok"
        print("Failed to connect")
        vendo['status'] = "nok"

        with file_lock:
          with open(jsonfilepath, 'w') as jsonfile:
            json.dump(vendodata, jsonfile, indent=2)
        
        # after saving not ok just continue with the next data on the list
        continue
      else:
        # If parsing completed wihtout error
        print("Parsing link successfull!")

        '''
        Overide the remotelink variable for using on getting dailysales and other data 
        as the remotelink written on this variable is the old remotelink
        '''
        remotelink = remlink
        
        vendo['remote_link'] = remlink

        response = requests.get(remotelink + '/admin/')
        if (response.status_code == 200):
          vendo['status'] = "ok"
        else:
          vendo['status'] = "nok"

        # save the new remotelink
        print("Saving new remotelink")
        with file_lock:
          with open(jsonfilepath, 'w') as jsonfile:
            json.dump(vendodata, jsonfile, indent=2)

    else:

      vendo['status'] = 'ok'
      dailysales = getsales(uname, pwd, remotelink)
      vendo['daily_sales'] = dailysales

      otherdata = get_otherdata(remotelink)
      vendo['online_users'] = otherdata[0]
      vendo['device_temp'] = otherdata[1]

    with file_lock:
      print(f"Saving Data for { vendo['name'] }")
      with open(jsonfilepath, 'w') as jsonfile:
        json.dump(vendodata, jsonfile, indent=2)


while True:
  try:
    Checkdata()
  except KeyboardInterrupt:
    print("Exiting...")
    break