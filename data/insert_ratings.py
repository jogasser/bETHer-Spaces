import requests
import urllib.request
import random
import json
import pytz
from datetime import datetime
import time

base_url = "http://localhost:6969/api/"

spaces_url = base_url + "spaces"
ratings_url = base_url + "ratings"


def post(payload, url):
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, json=payload, headers=headers)
    print(response.text)


def get_stars():
    return random.randint(1, 5)


def get_comment():
    if (random.randint(1, 15) == 2):
        return "Smelled like cauliflower :("

    num: int = random.randint(1, 3)
    if num == 1:
        return "Gets crowded"
    elif num == 2:
        return "Great spot to chill out and procrastinate"
    else:
        return "Loved it here :))"


with urllib.request.urlopen(spaces_url) as url:
    data = json.load(url)

    for space in data:
        if len(space['ratings']) == 0:

            for i in range(random.randint(3, 10)):
                payload = {"data": {
                    "cleanness": get_stars(),
                    "accessibility": get_stars(),
                    "cosiness": get_stars(),
                    "comment": get_comment(),
                    "space": space['id']
                }}

                post(payload, ratings_url)
