// will be needed to save requests and serve html page
var fs = require('fs');
// seperated auth for security reasons
var auth = require('./auth');

var http = require('http');
var SpotifyWebApi = require('spotify-web-api-node');

spotifyApi = new SpotifyWebApi(auth.Authentication);
spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        console.log('Expires in ' + data.body['expires_in']);
        console.log('Token = ' + data.body['access_token']);
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Token failed', err);
    });

http.createServer(function(req, res) {
    spotifyApi.searchTracks(search)
        .then(function(data) {
            // this gets the ui from the api response
            return data.body.tracks.items.map(function(t) { return t.uri; });
        })
        .then(function(data) {
            console.log(data);
        })
        .catch(function(error) {
            console.error(error);
        });
}).listen(8080);
