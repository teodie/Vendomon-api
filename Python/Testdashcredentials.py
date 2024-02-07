import requests
from bs4 import BeautifulSoup as BS
from sys import argv as argument

def login(username, password, URL ):
    '''
    Description:
    login function will post the credentials
    and return false if login is failed and 
    return the page soup when success

    Arguments:
    This will accept 3 arguments
    username: str
    password: str
    URL: srt
    '''

    # Headers for login
    data = {
        'username': username,
        'password': password,
        }

    params = {
        'execute': '1',
        'exec': 'login',
        }

    session = requests.session()
    response = session.post(URL + "/admin/", data=data, params=params)
    if response.text == 'success':
       return response.text
    else:
        return 'Failed'

print(login(argument[1], argument[2], argument[3]))
