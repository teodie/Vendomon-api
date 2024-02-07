from time import sleep as delay
from bs4 import BeautifulSoup as Bsoup

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common import exceptions

def GetRemoteLink(Email, Pwd):
    
    URL = 'https://dashboard.ngrok.com/login'
    EndPointURL = 'https://dashboard.ngrok.com/cloud-edge/endpoints'
    # Path where the driver is located
    driver_path = "C:/Users/Teodi_07/AwesomeProject/server/chromedriver-win64/chromedriver.exe"
    # This 2 lines allow to run the chrome headless
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')

    with webdriver.Chrome(service=ChromeService(driver_path), options=options) as driver:
        driver.get(URL)
        delay(3)
        driver.refresh()
        delay(2)
        driver.find_element(By.NAME,'email').send_keys(Email)
        delay(2)
        driver.find_element(By.NAME,'password').send_keys(Pwd + Keys.ENTER)
        delay(2)
        driver.get(EndPointURL)
        delay(3)
        js_code= "return document.getElementsByTagName('html')[0].innerHTML;"
        html_content = driver.execute_script(js_code)
        html_soup = Bsoup(html_content, 'html.parser')
        try:
            RemoteLink = str(html_soup.find(class_='ExternalLinkIconOnHover').text)
            return RemoteLink
        except Exception as e:
            print("Error: ", str(e))
            return "Error"

