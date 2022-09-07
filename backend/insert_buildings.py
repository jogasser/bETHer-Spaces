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


space_id = 0
polygon_id = 0

with open(json_file, "r") as source:
    data = json.load(source)
    for building in data["buildings"]:
        spaces = building['spaces']
        space_ids = []

        for space in spaces:
            space_id += 1
            space_ids.append(space_id)

            polygon_ids = []

            for polygon in space['polygons']:
                polygon_id += 1
                polygon_ids.append(polygon_id)

                polygon_payload = {"data": {
                    "lat": polygon['lat'],
                    "long": polygon['long'],
                }}

                post(polygon_payload, polygons_url)

            spaces_payload = {"data": {
                "name": space['name'],
                "seats": space['seats'],
                "polygons": polygon_ids
            }}

            post(spaces_payload, spaces_url)

        print(space_ids)

        building_payload = {"data": {
            "name": building['name'],
            "spaces": space_ids
        }}
        print(building_payload)

        post(building_payload, buildings_url)
