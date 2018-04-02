import settings
from urllib.request import urlopen

response = urlopen(settings.CLEAR_URL + settings.PASS)
print(response.read())
