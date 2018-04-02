import settings
from urllib.request import urlopen

def flush_queue():
    response = urlopen(settings.CLEAR_URL + settings.PASS)
    print(response.read())

flush_queue()
