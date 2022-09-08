import requests
import urllib.request

import json

json_file = 'measurements.json'
base_url = "http://localhost:6969/api/"

spaces_url = base_url + "spaces"


def post(payload, url):
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, json=payload, headers=headers)
    print(response.text)


def gen_measurements():
    return []


with urllib.request.urlopen(spaces_url) as url:
    data = json.load(url)

    for space in data:
        if len(space['measurements']) is 0:
            measurements = gen_measurements()
