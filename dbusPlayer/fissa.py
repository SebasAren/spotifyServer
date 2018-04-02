import settings
from mpris import MPRISRemote
from urllib.request import urlopen
import json

BASE_URL = 'http://localhost:8080/'
OVERVIEW_URL = BASE_URL + 'overview'
CLEAR_URL = BASE_URL + 'clear/?pass='
PASS = 'ditismijnservervreund'
remote = MPRISRemote()

def get_json():
    response = urlopen(OVERVIEW_URL)
    data = json.load(response)
    return data

def reset():
    urlopen(CLEAR_URL + PASS)

def add_to_queue(data):
    for song in data:
        remote.add_spotify_song(song['URI'])

add_to_queue(get_json())
