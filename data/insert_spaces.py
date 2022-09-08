"""Migrate the database entries from the old website to strapi. First get an API response from old website"""
import requests

import json

json_file = 'spaces.json'
base_url = "http://localhost:6969/api/"

spaces_url = base_url + "spaces"
polygons_url = base_url + "polygons"
upload_url = base_url + "upload"


def post(payload, url):
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, json=payload, headers=headers)
    print(response.text)


def upload_image(name: str):
    img_file_name = name.replace(" ", "_") + '.jpg'
    files = {'files': (img_file_name, open(
        'space_images/' + img_file_name, 'rb'), 'image', {'uri': ''})}

    response = requests.post(upload_url, files=files)

    if response.status_code == 200:
        res = json.loads(response.text)
        return res[0]['id']


with open(json_file, "r") as source:
    data = json.load(source)

    space_id = 1

    spaces = data['spaces']
    for space in spaces:

        spaces_payload = {"data": {
            "name": space['name'],
            "seats": space['seats'],
            "img": upload_image(space['name'])
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
