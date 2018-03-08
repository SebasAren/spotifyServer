# spotifyServer

## Problem
There is no easy way to get a fully automated spotify song request app for parties.

## Solution
I wrote a simple Node.js server backend and frontend to serve a simplistic website where users can search through the spotify music database and request a song to be played.

The "DJ" will be running the music player Clementine, which can be controlled by D-BUS commands through a python script. The 'DJ' can then stop worrying about the music and start drinking.

## Bugs/Issues
There are a lot of security issues, but seeing as the usage of this system will be very limited this will be probably not be much of an issue. The largest issue is the way in which the music player will be communicating with the webserver, as this is done over plain HTTP using an obscure path on the server.
