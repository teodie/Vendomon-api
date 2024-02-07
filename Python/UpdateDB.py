'''
This script do the following:
1. fetch the datafrom the database
2. Loop through all the vendo data and update them
'''

from datetime import datetime, timezone
import time

from Remotelingparser import GetRemoteLink
from getsales import getsales
from ScrapeOtherdata import get_otherdata
import requests

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://admin:adminpass@vendo-monitoring-app.xfer4bw.mongodb.net/?retryWrites=true&w=majority"

cluster = MongoClient(uri, server_api=ServerApi('1'))
db = cluster["test"]
collection = db["vendos"]


def fetchdata():
  # Send a ping to confirm a successful connection
  try:
      cluster.admin.command('ping')

      collec = collection.find({})

      return collec

  except Exception as e:
      print(e)
      return "error"


def isonline(lasttime):
  # lastime from the database is interms of milliseconds so devide it to 1k to convert in seconds
  lasttime = int(lasttime) // 1000
  # Get the current unix time
  current_datetime = int(time.time())

  # If the difference is greater than 5min then the code will assume that
  # user is offline and will not update his/her vendo datas 
  min = (current_datetime - lasttime) // 60
  if(min <= 2):
     return True
  else:
     return False 

  # print(datetime.utcfromtimestamp(lasttime))
  # print(datetime.utcfromtimestamp(current_datetime))

def Checkdata():
  #Loop through all data
  vendodata = fetchdata()

  for vendo in vendodata:

    # Check if user is online if the elapsed time is 5min from the last request and the current time
    # This code will assume that user is offline and will not update the vendo data that user own
    if not (isonline(vendo["last_request_time"])):
       continue
  

    print("Starting update for:", vendo['vendo_name'])

    id = vendo["_id"]
    userid = vendo["userid"]
    # Dashboard Credentials
    remotelink = vendo['remote_link']
    uname = vendo["dashboard_name"]
    pwd = vendo["dashboard_password"]

    # Ngrok Credentials
    email = vendo['ngrok_email']
    password = vendo['ngrok_password']
    status = 'ok'

    print(userid, remotelink, uname, pwd, email, password)

    # Test if the saved remote link is working
    response = requests.get(remotelink + '/admin/')
    
    if (response.status_code != 200):

      # This block of code will try to connect to the vendo
      print("Failed to load the saved remonte link \nParsing new link..")
      remlink = GetRemoteLink(email, password)

      print("remote_link:", remlink)

      if(remlink == "Error"):
        # Update status here to nok
        print("Parsing link failed!!\n")
        status = "nok"
        collection.update_one( {"_id": id } , {"$set": {"status": status} })

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

        response = requests.get(remotelink + '/admin/')
        if (response.status_code != 200):
          print("Remote link has been parsed but can't connect ot vendo machine")
          status = 'nok'

        # save the new remotelink
        print("Saving new remotelink")
        collection.update_one( {"_id": id}, {"$set": {'status': status, "remote_link": remotelink}})

    else:

      dailysales = getsales(uname, pwd, remotelink)
      otherdata = get_otherdata(remotelink)

      collection.update_one({"_id": id}, {"$set": {'status': status, 'daily_sales': dailysales, 'online_users': otherdata[0], 'device_temp': otherdata[1] }})


while True:
  try:
    Checkdata()
  except KeyboardInterrupt:
    print("Exiting...")
    break