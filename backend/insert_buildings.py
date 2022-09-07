"""Migrate the database entries from the old website to strapi. First get an API response from old website"""
import requests

import json

json_file = 'buildings.json'
# base_url = "https://bether.tenderribs.cc/api/"
base_url = "http://localhost:1337/api/"

spaces_url = base_url + "spaces"
buildings_url = base_url + "buildings"
polygons_url = base_url + "polygons"


def post(payload, url):
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, json=payload, headers=headers)
    print(response.text)


with open(json_file, "r") as source:
    data = json.load(source)

    building_id = 0
    space_id = 0

    for building in data["buildings"]:
        building_payload = {"data": {
            "name": building['name'],
        }}

        post(building_payload, buildings_url)

        building_id += 1
        spaces = building['spaces']
        for space in spaces:
            spaces_payload = {"data": {
                "name": space['name'],
                "seats": space['seats'],
                "building": building_id,
            }}

            post(spaces_payload, spaces_url)

            space_id += 1
            for polygon in space['polygons']:
                polygon_payload = {"data": {
                    "lat": polygon['lat'],
                    "long": polygon['long'],
                    "space": space_id
                }}

                post(polygon_payload, polygons_url)
