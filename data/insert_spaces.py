"""Migrate the database entries from the old website to strapi. First get an API response from old website"""
import requests

import json

json_file = 'spaces.json'
base_url = "http://localhost:6969/api/"

spaces_url = base_url + "spaces"
polygons_url = base_url + "polygons"


def post(payload, url):
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, json=payload, headers=headers)
    print(response.text)


with open(json_file, "r") as source:
    data = json.load(source)

    space_id = 1

    spaces = data['spaces']
    for space in spaces:
        spaces_payload = {"data": {
            "name": space['name'],
            "seats": space['seats'],
        }}

        post(spaces_payload, spaces_url)

        for polygon in space['polygons']:
            polygon_payload = {"data": {
                "lat": polygon['lat'],
                "lon": polygon['lon'],
                "space": space_id
            }}

            post(polygon_payload, polygons_url)

        space_id += 1
