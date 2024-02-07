import requests
from bs4 import BeautifulSoup as Bsoup


def clean_data(data):

        data_dict = {}
        # the next just remove the unwanted data and replace some newline for easy dict saving
        #print(data) # uncomment this if you want to see the data fetched
        unfiltered_data = data.replace('\n\n', '\n').replace('retry: 2000', '').replace('event: ', '').replace('data: ', '')
        filtered_data = unfiltered_data.lstrip('\n').replace('\n', '-').replace('--', '\n')
        filtered_data = filtered_data.rstrip().split('\n')

        for pair in filtered_data:

            # sample fix May 27
            # this fix ensure the if there is no online it won't give an error on spliting the part
            if pair == 'online' and '-' not in pair:
                pair = f"{pair}-0"
            elif pair.count('-') == 2 and 'transfer' in pair:
                pair = pair[1:]  # Remove the first character from the string

            key, value = pair.split('-')

            # Saving the key n value pair in the dictionary
            data_dict[key] = value

        return data_dict

def get_otherdata(remlink):

    link = remlink + '/admin/index?socket=1&mode=dashboard'
    response = requests.get(link)

    otherdata = clean_data(response.text)

    online = otherdata['online']
    temp = otherdata['temp'].replace('°', '')

    # This will return a tuple
    return online, temp

