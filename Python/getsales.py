import requests
from bs4 import BeautifulSoup as BS


def login(username, password, URL):
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
    response = session.post(URL, data=data, params=params)
    if response.text == 'success':
        soup = session.get(URL).content
        soup = BS(soup, 'html.parser')
        return soup
    else:
        print(response.text)
        return 'Failed'

def find_by_css(soup, tag, locator):
    '''
    Decription:
    This function will find and return the value of the 
    element with the matching locator value

    Argument:
    soup: This the the page source fetch from then login function
    if the log in is successfull
    tag: The tag of the element to locate
    locator: This is the class name of the element where the value wanted
    is to be extracted
    '''

    element = soup.find(tag, class_=locator).text.strip()
    return element

def getsales(uname, pwd, url):
    salesarr = {}
    dashboard_soup = login(uname, pwd, url + "/admin/")

    if dashboard_soup != 'Failed':
        daily_sales = find_by_css(dashboard_soup, 'span', 'kt-widget24__stats kt-font-brand').replace("₱", '')
        return daily_sales


